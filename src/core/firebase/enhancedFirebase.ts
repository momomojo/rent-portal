import { 
  collection,
  query,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  DocumentReference,
  QueryConstraint,
  Firestore
} from 'firebase/firestore';
import { RetryHandler } from '../api/RetryHandler';
import { CircuitBreaker } from '../api/CircuitBreaker';
import { ApiError } from '../api/types';
import { logger } from '../utils/logger';

export class EnhancedFirebaseClient {
  private readonly retryHandler: RetryHandler;
  private readonly circuitBreaker: CircuitBreaker;

  constructor(
    private readonly db: Firestore,
    private readonly collectionName: string
  ) {
    this.retryHandler = new RetryHandler({
      maxRetries: 3,
      initialDelay: 1000,
      maxDelay: 5000,
      backoffFactor: 1.5
    });

    this.circuitBreaker = new CircuitBreaker({
      failureThreshold: 5,
      resetTimeout: 30000, // 30 seconds
      halfOpenRequests: 2
    });
  }

  private async executeWithErrorHandling<T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> {
    try {
      return await this.circuitBreaker.execute(() =>
        this.retryHandler.execute(operation)
      );
    } catch (error: any) {
      const apiError = new ApiError(
        `Firebase ${operationName} operation failed: ${error.message}`,
        error.code === 'permission-denied' ? 403 : 500
      );

      logger.error(`Firebase ${operationName} error:`, {
        error,
        collection: this.collectionName,
        circuitBreakerState: this.circuitBreaker.getState()
      });

      throw apiError;
    }
  }

  async queryDocuments<T>(
    constraints: QueryConstraint[] = []
  ): Promise<T[]> {
    return this.executeWithErrorHandling(async () => {
      const q = query(collection(this.db, this.collectionName), ...constraints);
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
    }, 'query');
  }

  async getDocument<T>(documentId: string): Promise<T> {
    return this.executeWithErrorHandling(async () => {
      const docRef = this.getDocRef(documentId);
      const snapshot = await getDoc(docRef);
      
      if (!snapshot.exists()) {
        throw new ApiError('Document not found', 404);
      }
      
      return { id: snapshot.id, ...snapshot.data() } as T;
    }, 'get');
  }

  async setDocument<T>(
    documentId: string,
    data: Partial<T>
  ): Promise<void> {
    return this.executeWithErrorHandling(async () => {
      const docRef = this.getDocRef(documentId);
      await setDoc(docRef, data);
    }, 'set');
  }

  async updateDocument<T>(
    documentId: string,
    data: Partial<T>
  ): Promise<void> {
    return this.executeWithErrorHandling(async () => {
      const docRef = this.getDocRef(documentId);
      await updateDoc(docRef, data as any);
    }, 'update');
  }

  async deleteDocument(documentId: string): Promise<void> {
    return this.executeWithErrorHandling(async () => {
      const docRef = this.getDocRef(documentId);
      await deleteDoc(docRef);
    }, 'delete');
  }

  private getDocRef(documentId: string): DocumentReference {
    return collection(this.db, this.collectionName).doc(documentId);
  }

  getCircuitBreakerState() {
    return this.circuitBreaker.getState();
  }
}
