import { connect } from "@config"

const getRandomPins = async (page = 1) => {
    return await connect.get(`/pin/random-explore?page=${page}`)
}

export default {
    getRandomPins,

}