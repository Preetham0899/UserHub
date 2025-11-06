
import { call, put, takeLatest } from 'redux-saga/effects';
import { auth, firestore } from '../../firebase/firebase';
import {
  loginRequest, loginSuccess, loginFailure,
  logoutRequest, logoutSuccess, logoutFailure,
  registerRequest, registerSuccess, registerFailure,
} from '../slices/authSlice';

//  Helpers
const signIn = ({ email, password }) => auth().signInWithEmailAndPassword(email, password);
const signOut = () => auth().signOut();
const registerUser = ({ email, password }) => auth().createUserWithEmailAndPassword(email, password);
const setProfile = (uid, data) =>
  firestore().collection('profiles').doc(uid).set({
    ...data,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });

function* handleLogin({ payload }) {
  try {
    const res = yield call(signIn, payload);
    const user = { uid: res.user.uid, email: res.user.email };
    yield put(loginSuccess(user));
  } catch (e) {
    yield put(loginFailure(e.message));
  }
}

function* handleLogout() {
  try {
    yield call(signOut);
    yield put(logoutSuccess());
  } catch (e) {
    yield put(logoutFailure(e.message));
  }
}

function* handleRegister({ payload }) {
  try {
    const res = yield call(registerUser, { email: payload.email, password: payload.password });
    // Save basic profile doc (optional)
    yield call(setProfile, res.user.uid, { uid: res.user.uid, name: payload.name, email: res.user.email });
    const user = { uid: res.user.uid, email: res.user.email };
    yield put(registerSuccess(user));
  } catch (e) {
    yield put(registerFailure(e.message));
  }
}

export default function* authSaga() {
  yield takeLatest(loginRequest.type, handleLogin);
  yield takeLatest(logoutRequest.type, handleLogout);
  yield takeLatest(registerRequest.type, handleRegister);
}
