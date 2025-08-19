import './App.css'
import BusRouteListItem from "./components/BusRouteListItem.jsx";
import styled from "styled-components";
import {fetchBusRoutes} from "./service/api.js";
import {useEffect, useState} from "react";
import {mainUser} from "./mockData.js";

const BusRouteList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;`


function App() {
    const [busRoutes, setBusRoutes] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const response = await fetchBusRoutes();
            setBusRoutes(response.busRoutes);
        }

        fetchData().catch(err => console.log(err));
    }, [])

    return (
        <>
            <div>
                Hello {mainUser.name}!
            </div>
            <BusRouteList>
                {busRoutes.map((busRoute, key) => (
                    <BusRouteListItem from={busRoute.from} to={busRoute.to} timeOfDeparture={busRoute.timeOfDeparture}
                                      key={key}/>
                ))}
            </BusRouteList>
        </>
    )
}

export default App
