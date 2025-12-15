import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function saveScanToFirestore(data: {
  item: string;
  category: string;
  impactLevel: string;
  points: number;
  confidence: number;
  createdAt: Date;
}) {
  await addDoc(collection(db, 'scans'), data);
}
