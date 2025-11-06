
import { all, fork } from 'redux-saga/effects';
import authSaga from './sagas/authSaga';
import usersSaga from './sagas/usersSaga';

export default function* rootSaga() {
  yield all([fork(authSaga), fork(usersSaga)]);
}
