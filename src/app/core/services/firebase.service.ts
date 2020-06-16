import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Dataset } from 'src/app/shared/models/dataset.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private firestore: AngularFirestore) { }

  getDatasets() {
    return this.firestore.collection('datasets').snapshotChanges();
  }

  createDataset(dataset: Dataset) {
    return this.firestore.collection('datasets').add(dataset);
  }

  updateDataset(id: string, dataset: Dataset) {
    this.firestore.doc('datasets/' + id).update(dataset);
  }

  deleteDataset(datasetId: string) {
    this.firestore.doc('datasets/' + datasetId).delete();
  }

}
