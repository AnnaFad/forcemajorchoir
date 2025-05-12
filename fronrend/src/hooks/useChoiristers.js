import { useReducer, useEffect } from "react";
import { choiristersReducer, initialState } from "/src/reducers/choiristersReducer";
import { FETCH_ACTIONS } from "/src/actions";
import { API_URL } from "../main";
import axios from 'axios';

export const useChoiristers = () => {
  const [state, dispatch] = useReducer(choiristersReducer, initialState);

  const { items, loading, error } = state;

  console.log(items, loading, error);

  useEffect(() => {
    dispatch({ type: FETCH_ACTIONS.PROGRESS });

    const getItems = async () => {
      try {
        let response = await axios.get(API_URL + "choiristers");
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
