import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { firestore, auth } from "./firebase";

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  profilePicture?: string;
  traits?: string[];
  awards?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Get user profile from Firestore
 * @param userId - The user's Firebase Auth UID
 * @returns UserProfile object or null if not found
 */
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userDocRef = doc(firestore, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw new Error("Failed to load user profile");
  }
};

/**
 * Create a new user profile in Firestore
 * @param userId - The user's Firebase Auth UID
 * @param profileData - Initial profile data
 */
export const createUserProfile = async (
  userId: string,
  profileData: Partial<UserProfile>
): Promise<void> => {
  try {
    const userDocRef = doc(firestore, "users", userId);
    const newProfile: UserProfile = {
      uid: userId,
      displayName: profileData.displayName || "Space Explorer",
      email: profileData.email || "",
      profilePicture: profileData.profilePicture,
      traits: profileData.traits || [],
      awards: profileData.awards || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(userDocRef, newProfile);
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw new Error("Failed to create user profile");
  }
};

/**
 * Update user profile picture URL in Firestore
 * @param userId - The user's Firebase Auth UID
 * @param profilePictureUrl - The Firebase Storage download URL
 */
export const updateUserProfilePicture = async (
  userId: string,
  profilePictureUrl: string
): Promise<void> => {
  try {
    const userDocRef = doc(firestore, "users", userId);
    await updateDoc(userDocRef, {
      profilePicture: profilePictureUrl,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    throw new Error("Failed to update profile picture");
  }
};

/**
 * Update user profile data in Firestore
 * @param userId - The user's Firebase Auth UID
 * @param updates - Partial profile data to update
 */
export const updateUserProfile = async (
  userId: string,
  updates: Partial<UserProfile>
): Promise<void> => {
  try {
    const userDocRef = doc(firestore, "users", userId);
    await updateDoc(userDocRef, {
      ...updates,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new Error("Failed to update user profile");
  }
};

/**
 * Get or create user profile
 * Useful for ensuring a profile exists when the user logs in
 * @param userId - The user's Firebase Auth UID
 * @param defaultData - Default data if profile doesn't exist
 * @returns UserProfile object
 */
export const getOrCreateUserProfile = async (
  userId: string,
  defaultData?: Partial<UserProfile>
): Promise<UserProfile> => {
  try {
    const existingProfile = await getUserProfile(userId);
    
    if (existingProfile) {
      return existingProfile;
    }

    // Create new profile if it doesn't exist
    const currentUser = auth.currentUser;
    await createUserProfile(userId, {
      displayName: currentUser?.displayName || defaultData?.displayName || "Space Explorer",
      email: currentUser?.email || defaultData?.email || "",
      ...defaultData,
    });

    const newProfile = await getUserProfile(userId);
    if (!newProfile) {
      throw new Error("Failed to create profile");
    }

    return newProfile;
  } catch (error) {
    console.error("Error getting or creating user profile:", error);
    throw new Error("Failed to load user profile");
  }
};
