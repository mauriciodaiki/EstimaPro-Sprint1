import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

const estimationsCollection = collection(db, "estimations");

const normalizeText = (value) => (value ?? "").trim();

const normalizeAmount = (value) => {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
};

const toEstimation = (snapshot) => {
  const data = snapshot.data();

  return {
    id: snapshot.id,
    clientName: data.clientName ?? "",
    projectName: data.projectName ?? "",
    amount: normalizeAmount(data.amount),
    description: data.description ?? "",
    userId: data.userId ?? "",
    createdAt: data.createdAt ?? null,
    updatedAt: data.updatedAt ?? null,
  };
};

export const listEstimationsByUser = async (userId) => {
  const q = query(estimationsCollection, where("userId", "==", userId));
  const snapshots = await getDocs(q);

  return snapshots.docs
    .map(toEstimation)
    .sort((a, b) => {
      const aTime = a.updatedAt?.toMillis?.() ?? 0;
      const bTime = b.updatedAt?.toMillis?.() ?? 0;
      return bTime - aTime;
    });
};

export const createEstimation = async (userId, estimation) => {
  const payload = {
    clientName: normalizeText(estimation.clientName),
    projectName: normalizeText(estimation.projectName),
    amount: normalizeAmount(estimation.amount),
    description: normalizeText(estimation.description),
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const created = await addDoc(estimationsCollection, payload);
  return created.id;
};

export const updateEstimation = async (id, userId, estimation) => {
  const estimationRef = doc(db, "estimations", id);

  await updateDoc(estimationRef, {
    clientName: normalizeText(estimation.clientName),
    projectName: normalizeText(estimation.projectName),
    amount: normalizeAmount(estimation.amount),
    description: normalizeText(estimation.description),
    userId,
    updatedAt: serverTimestamp(),
  });
};

export const deleteEstimation = async (id) => {
  const estimationRef = doc(db, "estimations", id);
  await deleteDoc(estimationRef);
};
