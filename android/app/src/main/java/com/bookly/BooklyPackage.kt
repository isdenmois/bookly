package com.bookly

import com.bookly.statistics.StatisticsViewManager
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext

class BooklyPackage: ReactPackage {
    override fun createNativeModules(context: ReactApplicationContext) = emptyList<NativeModule>()

    override fun createViewManagers(context: ReactApplicationContext) = listOf(StatisticsViewManager(context))
}
