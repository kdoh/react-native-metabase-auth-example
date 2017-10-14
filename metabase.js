import { AsyncStorage } from 'react-native'

async function getItem (key) {
    return await AsyncStorage.getItem(key)
}

async function setItem(key, value) {
    return await AsyncStorage.setItem(key, value)
}

const DEFAULT_REQUEST_HEADERS = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
}

const Metabase = {
    fetchSessionTokenFromStorage: async () => {
        const token = await getItem('metabaseSessionToken')
        return token
    },
    login: async ({ username, password, metabaseUrl }) => {
        try {
            const request = await fetch(`https://${metabaseUrl}/api/session`, {
                method: 'POST',
                headers: DEFAULT_REQUEST_HEADERS,
                body: JSON.stringify({
                    username,
                    password
                })
            })
            const { id } = await request.json()
            await setItem('metabaseSessionToken', id)
            await setItem('metabaseUrl', metabaseUrl)
            return id
        } catch (error) {
            console.error(error)
            return false
        }
    },
    request: async (
        resource,
        requestParams = {
            method: 'GET',
            headers: DEFAULT_REQUEST_HEADERS
        }
    ) => {
        const token = await Metabase.fetchSessionTokenFromStorage()
        const urlPrefix = await getItem('metabaseUrl')
        if(!token) {
            return false
        }
        const params = {
            ...requestParams,
            headers: {
                ...requestParams.headers,
                'X-Metabase-Session': token
            }
        }

        try {
            const request = await fetch(`https://${urlPrefix}/api/${resource}`, params)
            const response = await request.json()
            console.log('response', response)
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
