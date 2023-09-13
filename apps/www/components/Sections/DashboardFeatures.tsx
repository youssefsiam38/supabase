import React from 'react'
import SectionContainer from '../Layouts/SectionContainer'
import BigTabs from '../BigTabs'
import { Badge } from 'ui'

const DashboardFeatures = (props: any) => {
  const { badge, title, tabs } = props

  return (
    <SectionContainer className="text-center !pt-0" id="dashboard">
      <div className="relative mb-8 lg:mb-12 border-t pt-16 sm:pt-18 md:pt-24 lg:pt-24">
        {badge && (
          <Badge size="large" color="brand" className="block py-2 mb-6 !text-sm">
            Hosted Studio
          </Badge>
        )}
        <h3 className="mb-8 text-2xl lg:text-4xl text-scale-1200">{title}</h3>
      </div>
      <div className="relative">
        <BigTabs tabs={tabs} />
      </div>
    </SectionContainer>
  )
}

export default DashboardFeatures
