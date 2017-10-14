import { AsyncStorage } from 'react-native'

const Metabase = {
    fetchSessionTokenFromStorage: async () => {
        const token = await AsyncStorage.getItem('metabaseSessionToken').then(token => {
            return token
        })
        return token
    },
    login: async ({ username, password, metabaseUrl }) => {
        try {
            const request = await fetch(`https://${metabaseUrl}/api/session`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    password
                })
            })
            const { id } = await request.json()
            Metabase.storeMetabaseSessionToken(id)
            return id
        } catch (error) {
            console.error(error)
            return false
        }
    },
    storeMetabaseSessionToken: async (token) => {
        try {
            await AsyncStorage.setItem('metabaseSessionToken', token)
        } catch (error) {
            console.error(error)
        }
    },
    request: async (url, requestParams = {}) => {
        const token = await Metabase.fetchSessionTokenFromStorage()
        if(!token) {
            return false
        }
        const params = Object.assign({}, requestParams, {
            ...requestParams,
            headers: {
                ...requestParams.headers,
                'X-Metabase-Session': token
            }
        })

        try {
            const request = await fetch(url, params)
            const response = await request.json()
            return response
        } catch (error) {
            console.error(error)
        }
    },
    logout: async () => {
        await AsyncStorage.removeItem('metabaseSessionToken')
    }
}

export default Metabase
