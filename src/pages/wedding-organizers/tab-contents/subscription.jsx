import { useEffect, useState } from 'react'
import { activeSubscriptions } from '../../../api/subscriptions'
import { AlertSVG } from '../../../assets/svgs'
import Container from '../../../components/container'
import Loading from '../../../components/loading'

// const subscriptionColors = {
//   Starter: '[#A3A3A3]', // Gray
//   Basic: '[#00A2FF]', // Bright Blue
//   Bronze: '[#CD7F32]', // Bronze
//   Silver: '[#C0C0C0]', // Silver
//   Gold: '[#FFD700]', // Gold
//   Platinum: '[#E5E4E2]', // Platinum
// }

export default function Subscription({ wo, woId, role }) {
  const [subscriptions, setSubscriptions] = useState([])
  //   const activeUntil = subscriptions[subscriptions.length - 1]?.activeUntil
  console.log('🚀 ~ Subscription ~ subscriptions:', subscriptions)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        let request
        if (role === 'ROLE_ADMIN') {
          request = { params: { woId } }
        }
        const response = await activeSubscriptions({ request })
        setSubscriptions(response.data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchSubscriptions()
  }, [woId, role])
  return (
    <Container>
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">Actives Subscription Information</h2>
          <p className="text-sm italic opacity-55">
            This section contains the list of packages you are currently subscribed to.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <h3 className="text-xl">Active Until:</h3>
          <span className="badge badge-success badge-lg rounded-md font-semibold">
            {!loading ? (
              new Date(wo?.activeUntil).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
            ) : (
              <Loading />
            )}
          </span>
        </div>
      </div>

      <div className="divider my-1" />

      {!loading ? (
        subscriptions.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {subscriptions.map((subscription) => (
              <SubscriptionCard key={subscription.id} subscription={subscription} />
            ))}
          </div>
        ) : (
          <SubscriptionAlert />
        )
      ) : (
        <Loading />
      )}
    </Container>
  )
}

const SubscriptionAlert = () => {
  return (
    <div role="alert" className="alert alert-warning">
      <AlertSVG />
      <span className="text-sm font-bold">You are currently not subscribed to any package.</span>
    </div>
  )
}

const SubscriptionCard = ({ subscription }) => {
  return (
    <div className={`card card-compact w-full max-w-xl shadow-lg`}>
      <div className="card-body">
        <h2 className="card-title">
          <span className="badge badge-primary badge-lg rounded-md font-semibold">
            {subscription?.subscriptionPacket.name}
          </span>
        </h2>

        <table className="table">
          <tbody>
            <tr>
              <td className="w-2/6 font-bold">Package</td>
              <td>{subscription?.subscriptionPacket.name}</td>
            </tr>
            <tr>
              <td className="w-2/6 font-bold">Description</td>
              <td>{subscription?.subscriptionPacket.description}</td>
            </tr>
            <tr>
              <td className="font-bold">Started At</td>
              <td>
                {new Date(subscription?.activeFrom).toLocaleString('id-ID', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </td>
            </tr>
            <tr>
              <td className="font-bold">Active Until</td>
              <td>
                {new Date(subscription?.activeUntil).toLocaleString('id-ID', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </td>
            </tr>
            <tr>
              <td className="font-bold">Created At</td>
              <td>
                {new Date(subscription?.transactionDate).toLocaleString('id-ID', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
