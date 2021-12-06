package com.bookly.statistics

import android.widget.LinearLayout
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager

private const val REACT_CLASS = "StatisticsView"

class StatisticsViewManager(val context: ReactApplicationContext) : ViewGroupManager<LinearLayout>() {
    override fun getName() = REACT_CLASS

    override fun createViewInstance(reactContext: ThemedReactContext) = StatisticFragment(reactContext)
}
