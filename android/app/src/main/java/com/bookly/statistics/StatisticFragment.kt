package com.bookly.statistics

import android.content.Context
import android.view.LayoutInflater
import android.widget.LinearLayout
import androidx.fragment.app.FragmentActivity
import com.facebook.react.bridge.ReactContext

class StatisticFragment(context: ReactContext) : LinearLayout(context) {
    init {
        val activity = context.currentActivity as FragmentActivity
        val inflater = context.getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater

//        val view = inflater.inflate(R.layout.fragment_statistic, this, false)

//        addView(view)
    }
}
