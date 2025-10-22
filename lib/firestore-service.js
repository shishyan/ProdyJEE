// Firestore Data Service - Replaces Prisma/SQLite API calls
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  setDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';

// Collection name
const STUDY_PLANS_COLLECTION = 'studyPlans';

/**
 * Fetch all study plans for the current user
 * @param {string} userId - User ID from Firebase Auth
 * @returns {Promise<Array>} Array of study plan objects
 */
export const fetchStudyPlans = async (userId) => {
  try {
    const q = query(
      collection(db, STUDY_PLANS_COLLECTION),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    
    const plans = [];
    querySnapshot.forEach((doc) => {
      plans.push({ id: doc.id, ...doc.data() });
    });
    
    return plans;
  } catch (error) {
    console.error('Error fetching study plans:', error);
    throw error;
  }
};

/**
 * Fetch a single study plan by unique_id
 * @param {string} uniqueId - Study plan unique_id
 * @returns {Promise<Object>} Study plan object
 */
export const fetchStudyPlan = async (uniqueId) => {
  try {
    const docRef = doc(db, STUDY_PLANS_COLLECTION, uniqueId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Study plan not found');
    }
  } catch (error) {
    console.error('Error fetching study plan:', error);
    throw error;
  }
};

/**
 * Save/Update a study plan
 * @param {string} userId - User ID from Firebase Auth
 * @param {Object} studyPlan - Study plan object with unique_id
 * @returns {Promise<void>}
 */
export const saveStudyPlan = async (userId, studyPlan) => {
  try {
    const { unique_id, ...planData } = studyPlan;
    
    const docRef = doc(db, STUDY_PLANS_COLLECTION, unique_id);
    await setDoc(docRef, {
      ...planData,
      userId,
      updatedAt: new Date().toISOString(),
      unique_id
    }, { merge: true });
    
    console.log('Study plan saved successfully');
  } catch (error) {
    console.error('Error saving study plan:', error);
    throw error;
  }
};

/**
 * Update specific fields in a study plan
 * @param {string} uniqueId - Study plan unique_id
 * @param {Object} updates - Fields to update
 * @returns {Promise<void>}
 */
export const updateStudyPlan = async (uniqueId, updates) => {
  try {
    const docRef = doc(db, STUDY_PLANS_COLLECTION, uniqueId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
    
    console.log('Study plan updated successfully');
  } catch (error) {
    console.error('Error updating study plan:', error);
    throw error;
  }
};

/**
 * Delete a study plan
 * @param {string} uniqueId - Study plan unique_id
 * @returns {Promise<void>}
 */
export const deleteStudyPlan = async (uniqueId) => {
  try {
    const docRef = doc(db, STUDY_PLANS_COLLECTION, uniqueId);
    await deleteDoc(docRef);
    
    console.log('Study plan deleted successfully');
  } catch (error) {
    console.error('Error deleting study plan:', error);
    throw error;
  }
};

/**
 * Subscribe to real-time updates for all study plans
 * @param {string} userId - User ID from Firebase Auth
 * @param {Function} callback - Function to call when data changes
 * @returns {Function} Unsubscribe function
 */
export const subscribeToStudyPlans = (userId, callback) => {
  const q = query(
    collection(db, STUDY_PLANS_COLLECTION),
    where('userId', '==', userId)
  );
  
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const plans = [];
    querySnapshot.forEach((doc) => {
      plans.push({ id: doc.id, ...doc.data() });
    });
    callback(plans);
  }, (error) => {
    console.error('Error listening to study plans:', error);
  });
  
  return unsubscribe;
};

/**
 * Batch import study plans (for initial migration)
 * @param {string} userId - User ID from Firebase Auth
 * @param {Array} studyPlans - Array of study plan objects
 * @returns {Promise<void>}
 */
export const batchImportStudyPlans = async (userId, studyPlans) => {
  try {
    const promises = studyPlans.map(plan => saveStudyPlan(userId, plan));
    await Promise.all(promises);
    console.log(`Successfully imported ${studyPlans.length} study plans`);
  } catch (error) {
    console.error('Error batch importing study plans:', error);
    throw error;
  }
};
