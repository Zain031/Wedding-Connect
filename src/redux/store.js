import { configureStore } from '@reduxjs/toolkit'
import authSlice from './feature/authSlice'
import BankAccountSLice from './feature/bankAccountSlice'
import BonusPackageSlice from './feature/bonusPackageSlice'
import citySlice from './feature/citySlice'
import imageSlice from './feature/imageSlice'
import OrderSlice from './feature/order-slice'
import statisticSlice from './feature/statistic-slice'
import SubscriptionsSlice from './feature/subscription'
import WeddingsPackagesSlice from './feature/weddingPackageSlice'

const store = configureStore({
  reducer: {
    auth: authSlice,
    city: citySlice,
    package: BonusPackageSlice,
    weddingPackage: WeddingsPackagesSlice,
    image: imageSlice,
    statistic: statisticSlice,
    order: OrderSlice,
    subscription: SubscriptionsSlice,
    bankAccount: BankAccountSLice,
  },
})

export default store
