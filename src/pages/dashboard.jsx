import { useEffect, useMemo, useState } from 'react'
import { default as ReactApexChart } from 'react-apexcharts'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Container from '../components/container'
import Headers from '../layouts/partials/header'
import { fetchBankAccount } from '../redux/feature/bankAccountSlice'
import { fetchOrders } from '../redux/feature/order-slice'
import { fetchStatistic } from '../redux/feature/statistic-slice'
import { fetchSubscriptions } from '../redux/feature/subscription'

const ApexChart = () => {
  const dispatch = useDispatch()
  const { subscriptions } = useSelector((state) => state.subscription)
  const { bank } = useSelector((state) => state.bankAccount)
  const bankLenth = bank.length

  console.log('🚀 ~ ApexChart ~ bankLenth:', bankLenth)
  console.log('🚀 ~ ApexChart ~ bank:', bank)

  console.log(subscriptions, '=====subscriptions===========')
  const statis = useSelector((state) => state.statistic)
  const { orders } = useSelector((state) => state.order)
  const [loading, setLoading] = useState(true)

  console.log(statis.statistics, '=====statistic===========')
  console.log(orders, '=====orders===========')

  // Initialize state for charts and loading
  const [loadingCharts, setLoadingCharts] = useState(true)
  const [series5, setSeries5] = useState([])
  const [options5, setOptions5] = useState({})

  // Using useMemo to memoize derived values
  const keyData = useMemo(() => statis?.statistics.countByStatus || {}, [statis])
  const sortedKeys = useMemo(
    () =>
      Object?.keys(keyData)
        .sort()
        .filter((key) => key !== 'ALL'),
    [keyData],
  )
  const sortedValues = useMemo(() => sortedKeys?.map((key) => keyData[key]), [sortedKeys, keyData])

  const sortedKeysAll = useMemo(
    () =>
      Object?.keys(keyData)
        .sort()
        .filter((key) => key === 'ALL'),
    [keyData],
  )
  const sortedValuesAll = useMemo(() => sortedKeysAll?.map((key) => keyData[key]), [sortedKeys, keyData])

  const sortedWOData = useMemo(() => {
    if (!statis?.statistics.weddingOrganizerList) return []
    return statis.statistics.weddingOrganizerList
      .map((wo) => ({ name: wo.name, data: wo.weddingPackageCount }))
      .sort((a, b) => b.data - a.data)
      .slice(0, 10)
  }, [statis])

  const woName = useMemo(() => sortedWOData.map((item) => item.name), [sortedWOData])
  const woPackageCount = useMemo(() => sortedWOData.map((item) => item.data), [sortedWOData])

  // Fetch data on initial render

  useEffect(() => {
    dispatch(fetchBankAccount())
    const fetchData = async () => {
      setLoading(true)
      setLoadingCharts(true)
      try {
        await dispatch(fetchStatistic())
        await dispatch(fetchOrders())
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
        setLoadingCharts(false)
      }
    }
    fetchData()
    dispatch(fetchSubscriptions())
  }, [dispatch])

  // Data income for chart
  const incomeData = statis.statistics.income || {}
  const sortedIncomeKeys = Object.keys(incomeData).sort()
  const sortedIncomeValues = sortedIncomeKeys.map((key) => incomeData[key])
  const totalPrice = sortedIncomeValues.reduce((total, value) => total + value, 0)
  const formattedTotalPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(totalPrice)

  // Chart series and options for line chart
  const series = [{ name: 'Sales', data: sortedIncomeValues }]
  const options = {
    chart: {
      height: '100%',
      type: 'line',
      toolbar: { show: false },
    },
    stroke: { width: 5, curve: 'smooth' },
    xaxis: {
      type: 'category',
      categories: sortedIncomeKeys,
      tickAmount: sortedIncomeKeys.length,
    },
    title: {
      text: 'Sales Data',
      align: 'left',
      style: { fontSize: '16px', color: '#666' },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        gradientToColors: ['#FDD835'],
        shadeIntensity: 1,
        type: 'horizontal',
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
  }

  // Donut chart data
  const orderStatusData = orders.countOrderByStatus || {}

  const sortedOrderKeys = Object.keys(orderStatusData).sort().slice(1, 8)
  const sortedOrderValues = sortedOrderKeys.map((key) => orderStatusData[key])

  const donutOptions = { labels: sortedOrderKeys }
  const donutSeries = sortedOrderValues

  const donutOptionsWO = { labels: sortedKeys }
  const donutSeriesWO = sortedValues

  // Bar chart for wedding organizers
  const barOptions = {
    chart: { height: 350, type: 'bar' },
    colors: ['#FF4560', '#775DD0', '#00E396', '#FEB019', '#008FFB'],
    plotOptions: { bar: { columnWidth: '50%', distributed: true } },
    dataLabels: { enabled: false },
    legend: { show: false },
    xaxis: {
      categories: woName,
      labels: {
        style: {
          fontSize: '12px',
          colors: [
            '#FF4560',
            '#775DD0',
            '#00E396',
            '#FEB019',
            '#008FFB',
            '#FF4560',
            '#775DD0',
            '#00E396',
            '#FEB019',
            '#008FFB',
          ],
        },
      },
    },
    title: {
      text: 'Top 10 Wedding Organizers by Package Count',
      align: 'left',
      style: { fontSize: '16px', color: '#666' },
    },
  }
  const barSeries = [{ data: woPackageCount }]

  // Update pie chart only when necessary
  useEffect(() => {
    if (sortedKeys.length > 0) {
      setSeries5(sortedValues)
      setOptions5({
        chart: {
          width: 500,
          type: 'pie',
        },
        labels: sortedKeys,
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 300,
              },
              legend: {
                position: 'bottom',
              },
              title: {
                text: 'Account Status',
                align: 'center',
                style: { fontSize: '16px', color: '#666' },
              },
            },
          },
        ],
      })
    }
  }, [sortedKeys, sortedValues])

  return (
    <Container>
      <Headers title="Dashboard" />

      {localStorage.getItem('role') === 'ROLE_WO' && (
        <>
          {bankLenth === 1 && (
            <>
              <div role="alert" className="alert bg-warning shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                  />
                </svg>

                <div>
                  <h3 className="font-bold">Your bank account is empty!</h3>
                  <div className="text-xs">please create in profile to add wedding packages and products</div>
                </div>
                <Link to={'/me'} className="btn btn-sm">
                  See Profile
                </Link>
              </div>
            </>
          )}
        </>
      )}

      <div className="stats mt-5 w-full shadow-md outline outline-1 outline-slate-300">
        <div className="stat">
          <div className="stat-title">Transaction (finished)</div>

          {localStorage.getItem('role') === 'ROLE_ADMIN' ? (
            <div className="stat-value">{orders?.countOrderByStatus?.FINISHED}</div>
          ) : (
            <div className="stat-value">{statis?.statistics?.countByStatus?.FINISHED || 0}</div>
          )}
        </div>

        <div className="stat">
          <div className="stat-title">Income</div>
          <div className="stat-value">{formattedTotalPrice}</div>
        </div>

        <div className="stat">
          <div className="stat-title">Total Transaction</div>

          {localStorage.getItem('role') === 'ROLE_ADMIN' ? (
            <div className="stat-value">{orders?.countOrderByStatus?.ALL}</div>
          ) : (
            <div className="stat-value">{statis?.statistics?.countByStatus?.ALL || 0}</div>
          )}
        </div>
      </div>

      {loading ? (
        <p></p>
      ) : (
        <div className="flex flex-col justify-center gap-2 md:flex-row">
          <div
            className="bg-base mt-2 w-full rounded-xl p-4 shadow-md outline outline-1 outline-slate-300 md:w-[740px]"
            id="chart"
          >
            <ReactApexChart options={options} series={series} type="line" height={250} />
          </div>

          <div className="donut bg-base mt-2 w-full rounded-xl pl-2 pr-20 pt-2 shadow-md outline outline-1 outline-slate-300 md:w-[500px]">
            <p className="text-[16px] font-bold text-[#666]">Transaction process </p>
            {statis.statistics.countByStatus?.ALL === 0 ? (
              <>
                <p className="text-[16px] font-bold">No Transaction</p>
              </>
            ) : (
              <>
                <ReactApexChart
                  options={localStorage.getItem('role') === 'ROLE_ADMIN' ? donutOptions : donutOptionsWO}
                  series={localStorage.getItem('role') === 'ROLE_ADMIN' ? donutSeries : donutSeriesWO}
                  type="donut"
                  className="item-center mt-2 w-[500px]"
                />
              </>
            )}
          </div>
        </div>
      )}

      {localStorage.getItem('role') === 'ROLE_ADMIN' && (
        <>
          {loadingCharts ? (
            <p></p>
          ) : (
            <div className="flex gap-2">
              <div
                id="chart"
                className="my-2 w-3/4 rounded-xl px-16 pt-1 shadow-lg outline outline-1 outline-slate-300"
              >
                <ReactApexChart options={barOptions} series={barSeries} type="bar" height={300} />
              </div>

              <div className="pie mt-2 h-[320px] w-1/3 rounded-xl pl-4 pt-5 shadow-xl outline outline-1 outline-slate-300">
                <p className="text-[16px] font-bold text-[#666]">Account ({sortedValuesAll})</p>
                <ReactApexChart options={options5} series={series5} height={300} type="pie" />
              </div>
            </div>
          )}
        </>
      )}

      {localStorage.getItem('role') === 'ROLE_WO' && (
        <>
          <div className="stats mt-2 h-36 w-full shadow-md outline outline-1 outline-slate-300">
            <div className="stat">
              <div className="stat-title">Total wedding Packages</div>

              <div className="stat-value text-5xl">
                {' '}
                <div className="flex gap-3 rounded-md bg-base-100 p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-16 rounded-md text-base-300"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                    />
                  </svg>
                  <p className="mt-3">{statis?.statistics?.weddingOrganizer?.weddingPackageCount}</p>
                </div>
              </div>
            </div>

            <div className="stat">
              <div className="stat-title">Total bonus package</div>
              <div className="stat-value text-5xl">
                {' '}
                <div className="flex gap-3 rounded-md bg-base-100 p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-16 rounded-md text-base-300"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                    />
                  </svg>

                  <p className="mt-3">{statis?.statistics?.weddingOrganizer?.productCount}</p>
                </div>
              </div>
            </div>

            <div className="stat">
              <div className="stat-title">Rating</div>
              <div className="stat-value text-5xl">
                {' '}
                <div className="flex gap-3 rounded-md bg-base-100 p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-16 rounded-md text-base-300"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                    />
                  </svg>

                  <p className="mt-3">{statis?.statistics?.weddingOrganizer?.rating}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Container>
  )
}

export default ApexChart
