import { useReducer, useEffect } from "react";
import { eventsReducer, initialState } from "/src/reducers/eventsReducer";
import { FETCH_ACTIONS } from "/src/actions";
import { API_URL } from "../main";
import axios from 'axios';

export const useEventsAll = () => {
  const [state, dispatch] = useReducer(eventsReducer, initialState);

  const { items, loading, error } = state;

  console.log(items, loading, error);

  useEffect(() => {
    dispatch({ type: FETCH_ACTIONS.PROGRESS });

    const getItems = async () => {
      try {
        let response = await axios.get(API_URL + "events_get/all");
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

export const useEventsTen = () => {
  const [state, dispatch] = useReducer(eventsReducer, initialState);

  const { items, loading, error } = state;

  console.log(items, loading, error);

  useEffect(() => {
    dispatch({ type: FETCH_ACTIONS.PROGRESS });

    const getItems = async () => {
      try {
        let response = await axios.get(API_URL + "events_get/ten");
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

export const useEventsOne = (id) => {
  const [state, dispatch] = useReducer(eventsReducer, initialState);

  const { items, loading, error } = state;

  console.log(items, loading, error);

  useEffect(() => {
    dispatch({ type: FETCH_ACTIONS.PROGRESS });

    const getItems = async () => {
      try {
        let response = await axios.get(API_URL + `events_get/${id}`);
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

export const useEvents = () => {
  const [state, dispatch] = useReducer(eventsReducer, initialState);

  const { items, loading, error } = state;

  console.log(items, loading, error);

  useEffect(() => {
    dispatch({ type: FETCH_ACTIONS.PROGRESS });

    const getItems = async () => {
      try {
        let response = await axios.get(API_URL + "events_get/all");
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