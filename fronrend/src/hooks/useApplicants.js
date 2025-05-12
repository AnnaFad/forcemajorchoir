import { useReducer, useEffect } from "react";
import { applicantsReducer, initialState } from "/src/reducers/applicantsReducer";
import { FETCH_ACTIONS } from "/src/actions";
import { API_URL } from "../main";
import axios from 'axios';

export const useApplicantsAll = (id) => {
  const [state, dispatch] = useReducer(applicantsReducer, initialState);

  const { items, loading, error } = state;

  console.log(items, loading, error);

  useEffect(() => {
    dispatch({ type: FETCH_ACTIONS.PROGRESS });

    const getItems = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        let response = await axios.get(API_URL + `admin_applicant_list/${id}/all`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        });
        if (response.status === 200) {
          dispatch({ type: FETCH_ACTIONS.SUCCESS, data: response.data });
        }
      } catch (err) {
        console.error(err);
        dispatch({ type: FETCH_ACTIONS.ERROR, error: err.message })
      }
    }

    getItems();

  }, []);

  return state;
}

export const useApplicantsNew = (id) => {
  const [state, dispatch] = useReducer(applicantsReducer, initialState);

  const { items, loading, error } = state;

  console.log(items, loading, error);

  useEffect(() => {
    dispatch({ type: FETCH_ACTIONS.PROGRESS });

    const getItems = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        let response = await axios.get(API_URL + `admin_applicant_list/${id}/new`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        });
        if (response.status === 200) {
          dispatch({ type: FETCH_ACTIONS.SUCCESS, data: response.data });
        }
      } catch (err) {
        console.error(err);
        dispatch({ type: FETCH_ACTIONS.ERROR, error: err.message })
      }
    }

    getItems();

  }, []);

  return state;
}

export const useApplicantsFailed = (id) => {
  const [state, dispatch] = useReducer(applicantsReducer, initialState);

  const { items, loading, error } = state;

  console.log(items, loading, error);

  useEffect(() => {
    dispatch({ type: FETCH_ACTIONS.PROGRESS });

    const getItems = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        let response = await axios.get(API_URL + `admin_applicant_list/${id}/fail`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        });
        if (response.status === 200) {
          dispatch({ type: FETCH_ACTIONS.SUCCESS, data: response.data });
        }
      } catch (err) {
        console.error(err);
        dispatch({ type: FETCH_ACTIONS.ERROR, error: err.message })
      }
    }

    getItems();

  }, []);

  return state;
}


export const useApplicantsPassed = (id) => {
  const [state, dispatch] = useReducer(applicantsReducer, initialState);

  const { items, loading, error } = state;

  console.log(items, loading, error);

  useEffect(() => {
    dispatch({ type: FETCH_ACTIONS.PROGRESS });

    const getItems = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        let response = await axios.get(API_URL + `admin_applicant_list/${id}/pass`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        });
        if (response.status === 200) {
          dispatch({ type: FETCH_ACTIONS.SUCCESS, data: response.data });
        }
      } catch (err) {
        console.error(err);
        dispatch({ type: FETCH_ACTIONS.ERROR, error: err.message })
      }
    }

    getItems();

  }, []);

  return state;
}

export const useApplicant = (id) => {
  const [state, dispatch] = useReducer(applicantsReducer, initialState);

  const { items, loading, error } = state;

  console.log(items, loading, error);

  useEffect(() => {
    dispatch({ type: FETCH_ACTIONS.PROGRESS });

    const getItems = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        let response = await axios.get(API_URL + `admin_applicant/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        });
        if (response.status === 200) {
          dispatch({ type: FETCH_ACTIONS.SUCCESS, data: response.data });
        }
      } catch (err) {
        console.error(err);
        dispatch({ type: FETCH_ACTIONS.ERROR, error: err.message })
      }
    }

    getItems();

  }, []);

  return state;
}