import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllElections } from "../../redux/thunks/electionThunks";

export const useElectionData = () => {
    const dispatch = useDispatch();
    const { elections } = useSelector((state) => state.election);

    useEffect(() => {
        dispatch(fetchAllElections());
    }, [dispatch]);

    console.log('Fetched election:', elections);

    return { elections };
};