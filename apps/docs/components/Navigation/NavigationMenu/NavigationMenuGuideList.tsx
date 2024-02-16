import * as Accordion from '@radix-ui/react-accordion'
import { useRouter } from 'next/router'
import React from 'react'
import NavigationMenuGuideListItems from './NavigationMenuGuideListItems'
import * as NavItems from './NavigationMenu.constants'
import { HeaderLogo } from './HomeMenu'

interface Props {
  id: string
  collapsible?: boolean
  value?: string[]
}
const NavigationMenuGuideList: React.FC<Props> = ({ id, value }) => {
  const router = useRouter()

  const menu = NavItems[id]

  // get url
  const url = router.asPath

  // We need to decide how deep we want the menu to be for matching urls
  // if the links are really deep, we don't want to match all the way out
  // But we need to reach out further to make the structure of  /resources/postgres/  work
  // look at /resources/postgres/  vs /auth/phone-login for how these are different
  let firstLevelRoute
  if (url.includes('resources/postgres/')) {
    firstLevelRoute = url?.split('/')?.slice(0, 5)?.join('/')
  } else {
    firstLevelRoute = url?.split('/')?.slice(0, 4)?.join('/')
  }

  return (
    <>
      <div className="top-0 sticky z-10">
        <div>
          <div>
            <div
              className={[
                'hidden lg:flex lg:height-auto',
                'pt-8 bg-background flex-col gap-8',
              ].join(' ')}
            >
              <HeaderLogo />
            </div>
            <div className="h-4 bg-background w-full"></div>
            <div className="bg-gradient-to-b from-background to-transparent h-4 w-full"></div>
          </div>
        </div>
      </div>
      <div
        className={[
          'transition-all ease-out duration-200',
          'absolute left-0 right-0 h-screen',
          'px-5 pl-5 py-16',
          'top-[0px]',
          'bg-background',
          // desktop styles
          'lg:relative lg:top-0 lg:left-0 lg:pb-10 lg:px-10 lg:pt-0 lg:flex',
          'lg:opacity-100 lg:visible',
        ].join(' ')}
      >
        <div className="transition-all duration-150 ease-out opacity-100 ml-0 delay-150">
          <Accordion.Root
            collapsible={true}
            key={id}
            type={value ? 'multiple' : 'single'}
            value={value ?? firstLevelRoute}
            className="transition-all duration-150 ease-out opacity-100 ml-0 delay-150"
          >
            <NavigationMenuGuideListItems menu={menu} id={id} />
          </Accordion.Root>
        </div>
      </div>
    </>
  )
}

export default NavigationMenuGuideList
