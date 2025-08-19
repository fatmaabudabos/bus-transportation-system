const backendUrl = "http://localhost:3000"

export const fetchBusRoutes = async () => {
    const url = `${backendUrl}/bus/routes`;
    const response = await fetch(url);
    return await response.json();
}