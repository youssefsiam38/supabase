import React from 'react'
import LW11Canvas from '../../components/LaunchWeek/11/LW11Canvas'
import DefaultLayout from '../../components/Layouts/Default'
import SectionContainer from '../../components/Layouts/SectionContainer'

const LW11 = () => {
  return (
    <DefaultLayout className="overflow-none">
      <SectionContainer>
        <div className="mx-auto relative w-full"></div>
      </SectionContainer>
      <LW11Canvas />
    </DefaultLayout>
  )
}

export default LW11
