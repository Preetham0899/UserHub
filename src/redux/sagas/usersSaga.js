
import { call, put, take, takeLatest, takeEvery, fork, select } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import api from '../../api/axiosClient';
import { firestore } from '../../firebase/firebase';
import {
  fetchSeedRequest, fetchSeedSuccess, fetchSeedFailure,
  addUserRequest, addUserSuccess, addUserFailure,
  deleteUserRequest, deleteUserSuccess, deleteUserFailure,
  enqueueAction, clearQueue, connectivityChanged, setCustomUsers,
} from '../slices/usersSlice';
import { createNetInfoChannel } from './netInfoChannel';


const fetchSeed = () => api.get('/users');


const addUserToFirestore = (payload) =>
  firestore().collection('users').add({
    name: payload.name,
    email: payload.email,
    phone: payload.phone || '',
    createdAt: firestore.FieldValue.serverTimestamp(),
  });

// --- Firestore snapshot channel
function usersSnapshotChannel() {
  return eventChannel((emit) => {
    const unsubscribe = firestore()
      .collection('users')
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        (snap) => {
          const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          emit({ type: 'ok', list });
        },
        (err) => emit({ type: 'err', err })
      );
    return () => unsubscribe();
  });
}

function* handleFetchSeed() {
  try {
    const res = yield call(fetchSeed);
    yield put(fetchSeedSuccess(res.data || []));
  } catch (e) {
    yield put(fetchSeedFailure(e.message));
  }
}

function* handleAddUser({ payload }) {
  const isConnected = yield select((s) => s.users.isConnected);
  if (!isConnected) {
    // Queue for later and optimistic succeed
    yield put(enqueueAction({ type: 'ADD_USER', payload }));
    yield put(addUserSuccess());
    return;
  }
  try {
    yield call(addUserToFirestore, payload);
    yield put(addUserSuccess());
  } catch (e) {
    // On failure (transient), queue it for later
    yield put(enqueueAction({ type: 'ADD_USER', payload }));
    yield put(addUserFailure(e.message));
  }
}
function* handleDeleteUser(action) {
  try {
    const userId = action.payload;

    // Delete from Firestore (if exists)
    yield call(() => firestore().collection('users').doc(userId).delete());

    // Update store instantly
    yield put(deleteUserSuccess(userId));
  } catch (err) {
    console.error('Delete error:', err);
    yield put(deleteUserFailure(err.message));
  }
}


function* flushQueue() {
  const q = yield select((s) => s.users.queue);
  for (const item of q) {
    if (item.type === 'ADD_USER') {
      try {
        yield call(addUserToFirestore, item.payload);
      } catch (_) {
        // swallow and keep trying next online cycle
      }
    }
  }
  yield put(clearQueue());
}

function* watchUsersCollection() {
  const chan = yield call(usersSnapshotChannel);
  try {
    while (true) {
      const msg = yield take(chan);
      if (msg.type === 'ok') yield put(setCustomUsers(msg.list));
      else console.warn('Firestore users error:', msg.err);
    }
  } finally {
    chan.close && chan.close();
  }
}

function* watchConnectivity() {
  const chan = yield call(createNetInfoChannel);
  while (true) {
    const { isConnected } = yield take(chan);
    yield put(connectivityChanged(isConnected));
    if (isConnected) yield call(flushQueue);
  }
}

export default function* usersSaga() {
  yield takeLatest(fetchSeedRequest.type, handleFetchSeed);
  yield takeEvery(addUserRequest.type, handleAddUser);
  yield fork(watchUsersCollection);
  yield fork(watchConnectivity);
  yield takeLatest(deleteUserRequest.type, handleDeleteUser);
}
