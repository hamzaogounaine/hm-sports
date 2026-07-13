import axios from "axios";

// Fetch the entire dictionary map once
export async function getChannelMap() {
    try {
        const response = await axios.get(process.env.NEXT_PUBLIC_CHANNELS_GIST_URL + "?t=" + Date.now());
        return response.data || {};
    } catch (error) {
        console.error("Failed to fetch channel mapping data:", error.message);
        return {};
    }
}