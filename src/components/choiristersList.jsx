import { useReducer, useEffect } from "react";
import { choiristersReducer, initialState } from "../reducers/choiristersReducer";
import { FETCH_ACTIONS } from "../actions";

import axios from "axios";

const ChoiristersList = () => {

  const [state, dispatch] = useReducer(choiristersReducer, initialState);

  const { items, loading, error} = state;

  console.log(items, loading, error);

  useEffect(() => {
    dispatch({type: FETCH_ACTIONS.PROGRESS});

    const getItems = async () => {
      try{
        let response = await axios.get("http://localhost:3000/choir");
        if (response.status === 200) {
          dispatch({type: FETCH_ACTIONS.SUCCESS, data: response.data});
        }
      } catch(err){
        console.error(err);
        dispatch({type: FETCH_ACTIONS.ERROR, error: err.message})
      }
    }

    getItems();

  }, []);


  return (
    <div className="flex flex-col m-8 w-2/5">
      {
        loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <ul className="flex flex-col">
            <h2 className="text-3xl my-4">Item List</h2>
            {
              items.map((item) => (
                <li
                  className="flex flex-col p-2 my-2 bg-gray-200 border rounded-md" 
                  key={item.id}>
                  <p className='my-2 text-xl'>
                    <strong>{item.first_name}</strong> {' '} {item.photo} of type <strong>{item.voice}</strong>
                    {' '} costs <strong>{item.last_name}</strong> INR/KG.
                  </p>

                </li>
              ))
            }
            
          </ul>
        )
      }

    </div>
  )
}

export default ChoiristersList