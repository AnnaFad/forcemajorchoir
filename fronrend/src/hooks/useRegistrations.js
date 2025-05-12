import { useReducer, useEffect } from "react";
import { registrationsReducer, initialState } from "/src/reducers/registrationsReducer";
import { FETCH_ACTIONS } from "/src/actions";
import { API_URL } from "../main";
import axios from 'axios';

export const useRegistrationsAll = (id) => {
  const [state, dispatch] = useReducer(registrationsReducer, initialState);

  const { items, loading, error } = state;

  console.log(items, loading, error);

  useEffect(() => {
    dispatch({ type: FETCH_ACTIONS.PROGRESS });

    const getItems = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        let response = await axios.get(API_URL + `admin_visitor_list/${id}`, {
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

export const useVisitor = (id) => {
  const [state, dispatch] = useReducer(registrationsReducer, initialState);

  const { items, loading, error } = state;

  console.log(items, loading, error);

  useEffect(() => {
    dispatch({ type: FETCH_ACTIONS.PROGRESS });

    const getItems = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        let response = await axios.get(API_URL + `admin_visitor/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        }
        );
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