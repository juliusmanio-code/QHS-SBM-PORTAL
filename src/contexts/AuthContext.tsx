import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  UserProfile,
  UserRole,
  UserStatus
} from '../types';
import { DEMO_USERS } from '../data/sbmMasterData';
import {
  auth,
  db,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  googleProvider,
  onAuthStateChanged,
  FirebaseUser
} from '../lib/firebase';
import { recordAuditEvent } from '../lib/audit';

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  role: UserRole;
  isApproved: boolean;
  isSuperAdmin: boolean;
  isSchoolHead: boolean;
  isCoordinator: boolean;
  isDimensionLeader: (dimId?: number) => boolean;
  isContributor: (indId?: number) => boolean;
  isValidator: boolean;
  isPublicVisitor: boolean;
  canEditIndicator: (indicatorNumber: number, dimensionId: number) => boolean;
  canReviewMov: (dimensionId: number) => boolean;
  canApproveMov: () => boolean;
  canAccessConfidential: (level: string) => boolean;
  switchDemoRole: (targetRole: UserRole) => void;
  signInWithGoogleAuth: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string, dept: string) => Promise<void>;
  logoutUser: () => Promise<void>;
  allUsers: UserProfile[];
  updateUserAccount: (
    userId: string,
    updates: Partial<UserProfile>,
    reason?: string
  ) => Promise<void>;
  createUserAccount: (
    userData: Omit<UserProfile, 'createdAt' | 'updatedAt'>
  ) => Promise<void>;
  deleteUserAccount: (userId: string) => Promise<void>;
  resetUsersToDefault: () => void;
  refreshUsers: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_USERS_KEY = 'qhs_sbm_users_v2';
const ACTIVE_USER_ID_KEY = 'qhs_sbm_active_user_id_v2';

const sanitizeUser = (user: UserProfile): UserProfile => {
  let name = user.displayName || '';
  if (name.includes('(Super Admin)')) {
    name = name.replace('(Super Admin)', '(System Admin)');
  }
  let designation = user.designation || '';
  if (designation.includes('Super Administrator')) {
    designation = designation.replace('Super Administrator', 'System Administrator');
  }
  return {
    ...user,
    displayName: name,
    designation
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    // Check v2 key first, then fallback to v1 migration
    const savedActiveId =
      localStorage.getItem(ACTIVE_USER_ID_KEY) || localStorage.getItem('qhs_sbm_active_user_id_v1');
    const savedUsersStr =
      localStorage.getItem(LOCAL_USERS_KEY) || localStorage.getItem('qhs_sbm_users_v1');
    const rawUsers: UserProfile[] = savedUsersStr ? JSON.parse(savedUsersStr) : DEMO_USERS;
    const users = rawUsers.map(sanitizeUser);
    const found = users.find((u) => u.id === savedActiveId);
    return found ? sanitizeUser(found) : sanitizeUser(users[0]);
  });
  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => {
    const savedUsersStr =
      localStorage.getItem(LOCAL_USERS_KEY) || localStorage.getItem('qhs_sbm_users_v1');
    const rawUsers: UserProfile[] = savedUsersStr ? JSON.parse(savedUsersStr) : DEMO_USERS;
    return rawUsers.map(sanitizeUser);
  });
  const [loading, setLoading] = useState<boolean>(false);

  // Sync users to LocalStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(allUsers));
  }, [allUsers]);

  // Sync active user ID
  useEffect(() => {
    if (userProfile) {
      localStorage.setItem(ACTIVE_USER_ID_KEY, userProfile.id);
    }
  }, [userProfile]);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        // Fetch or create profile
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            const data = snap.data() as UserProfile;
            setUserProfile(data);
          } else {
            // New user registration flow
            const isInitialAdmin = fbUser.email === 'julius.manio@depedqc.ph';
            const newProf: UserProfile = {
              id: fbUser.uid,
              email: fbUser.email || '',
              displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'DepEd Educator',
              photoURL: fbUser.photoURL || undefined,
              role: isInitialAdmin ? 'super_admin' : 'sbm_coordinator',
              status: 'approved',
              department: 'Academics',
              assignedDimensions: [1, 2, 3, 4, 5, 6],
              assignedIndicators: Array.from({ length: 42 }, (_, i) => i + 1),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            await setDoc(userDocRef, newProf);
            setUserProfile(newProf);
            setAllUsers((prev) => [...prev.filter((u) => u.id !== newProf.id), newProf]);
          }
        } catch (err) {
          console.warn('Firestore user fetch:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const refreshUsers = async () => {
    try {
      const snap = await getDocs(collection(db, 'users'));
      if (!snap.empty) {
        const fetched: UserProfile[] = [];
        snap.forEach((d) => fetched.push(d.data() as UserProfile));
        setAllUsers(fetched);
      }
    } catch {
      // Keep local users
    }
  };

  const switchDemoRole = (targetRole: UserRole) => {
    const matched = allUsers.find((u) => u.role === targetRole);
    if (matched) {
      setUserProfile(matched);
      recordAuditEvent(matched, 'ROLE_SWITCH_DEMO', 'UserProfile', matched.id, {
        newValue: targetRole
      });
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      const userDoc = await getDoc(doc(db, 'users', cred.user.uid));
      if (userDoc.exists()) {
        const prof = userDoc.data() as UserProfile;
        setUserProfile(prof);
        recordAuditEvent(prof, 'LOGIN_EMAIL', 'User', prof.id);
      }
    } catch {
      // Fallback: match in demo users list
      const matched = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (matched) {
        setUserProfile(matched);
        recordAuditEvent(matched, 'LOGIN_LOCAL', 'User', matched.id);
      } else {
        throw new Error('Invalid email or password. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (
    email: string,
    pass: string,
    name: string,
    dept: string
  ) => {
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      const newProf: UserProfile = {
        id: cred.user.uid,
        email,
        displayName: name,
        role: 'contributor',
        status: 'pending',
        department: dept,
        assignedDimensions: [1],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'users', cred.user.uid), newProf);
      setUserProfile(newProf);
      setAllUsers((prev) => [...prev, newProf]);
      recordAuditEvent(newProf, 'REGISTER_ACCOUNT', 'User', newProf.id);
    } catch {
      // Fallback local registration
      const newProf: UserProfile = {
        id: `user-${Date.now()}`,
        email,
        displayName: name,
        role: 'contributor',
        status: 'pending',
        department: dept,
        assignedDimensions: [1],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setUserProfile(newProf);
      setAllUsers((prev) => [...prev, newProf]);
      recordAuditEvent(newProf, 'REGISTER_LOCAL', 'User', newProf.id);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogleAuth = async () => {
    setLoading(true);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const snap = await getDoc(doc(db, 'users', res.user.uid));
      if (snap.exists()) {
        setUserProfile(snap.data() as UserProfile);
      } else {
        const isInitialAdmin = res.user.email === 'julius.manio@depedqc.ph';
        const newProf: UserProfile = {
          id: res.user.uid,
          email: res.user.email || '',
          displayName: res.user.displayName || 'DepEd Educator',
          photoURL: res.user.photoURL || undefined,
          role: isInitialAdmin ? 'super_admin' : 'contributor',
          status: isInitialAdmin ? 'approved' : 'pending',
          department: 'Academics',
          assignedDimensions: isInitialAdmin ? [1, 2, 3, 4, 5, 6] : [1],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        await setDoc(doc(db, 'users', res.user.uid), newProf);
        setUserProfile(newProf);
        setAllUsers((prev) => [...prev.filter((u) => u.id !== newProf.id), newProf]);
      }
      recordAuditEvent(userProfile, 'LOGIN_GOOGLE', 'User', res.user.uid);
    } catch (err: any) {
      console.warn('Google Sign-in:', err);
      // If popup blocked or unavailable, simulate or throw
      throw new Error(err.message || 'Google sign-in could not be completed.');
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    if (userProfile) {
      recordAuditEvent(userProfile, 'LOGOUT', 'User', userProfile.id);
    }
    try {
      await signOut(auth);
    } catch {
      // ignore
    }
    // Switch to public visitor view on logout
    const visitor = allUsers.find((u) => u.role === 'public_visitor') || {
      id: 'guest-visitor',
      email: 'public@depedqc.ph',
      displayName: 'Public Visitor',
      role: 'public_visitor',
      status: 'approved',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setUserProfile(visitor);
  };

  const updateUserAccount = async (
    userId: string,
    updates: Partial<UserProfile>,
    reason?: string
  ) => {
    const updatedUsers = allUsers.map((u) => {
      if (u.id === userId) {
        return {
          ...u,
          ...updates,
          updatedAt: new Date().toISOString()
        };
      }
      return u;
    });

    setAllUsers(updatedUsers);
    if (userProfile?.id === userId) {
      setUserProfile((prev) => (prev ? { ...prev, ...updates } : null));
    }

    try {
      await setDoc(doc(db, 'users', userId), updates, { merge: true });
    } catch (e) {
      console.warn('Firestore user update:', e);
    }

    recordAuditEvent(userProfile, 'UPDATE_USER_ROLE_OR_STATUS', 'UserProfile', userId, {
      newValue: JSON.stringify(updates),
      reason
    });
  };

  const createUserAccount = async (
    userData: Omit<UserProfile, 'createdAt' | 'updatedAt'>
  ) => {
    const newUser: UserProfile = {
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updatedUsers = [...allUsers.filter((u) => u.id !== newUser.id), newUser];
    setAllUsers(updatedUsers);

    try {
      await setDoc(doc(db, 'users', newUser.id), newUser);
    } catch (e) {
      console.warn('Firestore create user:', e);
    }

    recordAuditEvent(userProfile, 'CREATE_USER_ACCOUNT', 'UserProfile', newUser.id, {
      newValue: `${newUser.displayName} (${newUser.role})`
    });
  };

  const deleteUserAccount = async (userId: string) => {
    const targetUser = allUsers.find((u) => u.id === userId);
    const updatedUsers = allUsers.filter((u) => u.id !== userId);
    setAllUsers(updatedUsers);

    recordAuditEvent(userProfile, 'DELETE_USER_ACCOUNT', 'UserProfile', userId, {
      previousValue: targetUser?.displayName || userId
    });
  };

  const resetUsersToDefault = () => {
    setAllUsers(DEMO_USERS);
    const current = DEMO_USERS.find((u) => u.id === userProfile?.id) || DEMO_USERS[0];
    setUserProfile(current);
    recordAuditEvent(userProfile, 'RESET_USERS_TO_DEFAULT', 'System', 'all');
  };

  const role = userProfile?.role || 'public_visitor';
  const isApproved = userProfile?.status === 'approved';

  const isSuperAdmin = isApproved && role === 'super_admin';
  const isSchoolHead = isApproved && (role === 'school_head' || isSuperAdmin);
  const isCoordinator = isApproved && (role === 'sbm_coordinator' || isSchoolHead);

  const isDimensionLeader = (dimId?: number) => {
    if (!isApproved) return false;
    if (isCoordinator) return true;
    if (role !== 'dimension_leader') return false;
    if (dimId === undefined) return true;
    return Boolean(userProfile?.assignedDimensions?.includes(dimId));
  };

  const isContributor = (indId?: number) => {
    if (!isApproved) return false;
    if (isDimensionLeader()) return true;
    if (role !== 'contributor') return false;
    if (indId === undefined) return true;
    return Boolean(userProfile?.assignedIndicators?.includes(indId));
  };

  const isValidator = isApproved && (role === 'validator' || isCoordinator);
  const isPublicVisitor = role === 'public_visitor' || !isApproved;

  const canEditIndicator = (indicatorNumber: number, dimensionId: number) => {
    if (!isApproved) return false;
    if (isSuperAdmin) return true;
    if (isSchoolHead) return true;
    if (isCoordinator) return true;
    if (isValidator) return true; // SDO QC / Division Validators validate & calibrate manifestation under DO 007 s. 2024
    if (isDimensionLeader(dimensionId)) return true;
    if (isContributor(indicatorNumber)) return true;
    // If contributor has no assignedIndicators array or it's empty, permit indicator editing
    if (role === 'contributor' && (!userProfile?.assignedIndicators || userProfile.assignedIndicators.length === 0)) {
      return true;
    }
    return false;
  };

  const canReviewMov = (dimensionId: number) => {
    if (!isApproved) return false;
    if (isCoordinator) return true;
    if (isDimensionLeader(dimensionId)) return true;
    return false;
  };

  const canApproveMov = () => {
    if (!isApproved) return false;
    return isSchoolHead || isCoordinator;
  };

  const canAccessConfidential = (level: string) => {
    if (level === 'public' || level === 'internal') return true;
    if (!isApproved) return false;
    if (isCoordinator || isSchoolHead) return true;
    if (level === 'restricted') {
      return role === 'dimension_leader' || role === 'validator';
    }
    if (level === 'confidential') {
      return isSchoolHead || isCoordinator;
    }
    return false;
  };

  const contextValue = useMemo<AuthContextType>(
    () => ({
      firebaseUser,
      userProfile,
      loading,
      role,
      isApproved,
      isSuperAdmin,
      isSchoolHead,
      isCoordinator,
      isDimensionLeader,
      isContributor,
      isValidator,
      isPublicVisitor,
      canEditIndicator,
      canReviewMov,
      canApproveMov,
      canAccessConfidential,
      switchDemoRole,
      signInWithGoogleAuth,
      loginWithEmail,
      registerWithEmail,
      logoutUser,
      allUsers,
      updateUserAccount,
      createUserAccount,
      deleteUserAccount,
      resetUsersToDefault,
      refreshUsers
    }),
    [
      firebaseUser,
      userProfile,
      loading,
      role,
      isApproved,
      isSuperAdmin,
      isSchoolHead,
      isCoordinator,
      allUsers
    ]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
