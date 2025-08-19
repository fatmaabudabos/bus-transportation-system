import styled from "styled-components";

const BusRouteListItem = ({from, to, timeOfDeparture}) => {
    const Card = styled.div`
    padding: 16px;
    background-color: white;
    color: black`



    return <Card>
        <p>🚌From: {from} To: {to}</p>
        <p>Time of departure: {timeOfDeparture}</p>
    </Card>
}


export default BusRouteListItem;