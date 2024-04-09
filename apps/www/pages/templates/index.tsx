import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { useDebounce } from 'use-debounce'
import DefaultLayout from '~/components/Layouts/Default'
import ProductHeaderCentered from '~/components/Sections/ProductHeaderCentered'
import SectionContainer from '~/components/Layouts/SectionContainer'
import supabase from '~/lib/supabaseMisc'
import { Input } from 'ui'
import { Loader, Search } from 'lucide-react'

import pageData from '~/data/templates'
import { Partner } from '../../types/partners'
import TileGrid from '../../components/Partners/TileGrid'
import PartnerLinkBox from '../../components/Partners/PartnerLinkBox'

interface Props {
  partners: Partner[]
}

const Templates = (props: Props) => {
  const router = useRouter()
  const initialPartners = props.partners ?? []
  const [partners, setPartners] = useState(initialPartners)

  const allCategories = Array.from(new Set(initialPartners?.map((p) => p.category)))

  const [search, setSearch] = useState('')
  const [debouncedSearchTerm] = useDebounce(search, 300)
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    const searchPartners = async () => {
      setIsSearching(true)

      let query = supabase
        .from('partners')
        .select('*')
        .eq('approved', true)
        .order('category')
        .order('title')

      if (search.trim()) {
        query = query.textSearch('tsv', `${search.trim()}`, {
          type: 'websearch',
          config: 'english',
        })
      }

      const { data: partners } = await query

      return partners
    }

    if (search.trim() === '') {
      setIsSearching(false)
      setPartners(initialPartners)
      return
    }

    searchPartners().then((partners) => {
      if (partners) {
        setPartners(partners)
      }

      setIsSearching(false)
    })
  }, [debouncedSearchTerm, router])

  return (
    <>
      <NextSeo
        title={pageData.metaTitle}
        description={pageData.metaDescription}
        openGraph={{
          title: pageData.metaTitle,
          description: pageData.metaDescription,
          url: `https://supabase.com/partners`,
          images: [
            {
              url: `https://supabase.com${router.basePath}/images/og/integrations.png`, // TODO
            },
          ],
        }}
      />
      <DefaultLayout>
        <div className="relative bg-alternative overflow-hidden">
          <SectionContainer className="overflow-hidden pt-8 !pb-0 md:pt-12">
            <ProductHeaderCentered {...pageData.heroSection} />
          </SectionContainer>
          <SectionContainer>
            <div className="grid space-y-12 md:gap-8 lg:grid-cols-12 lg:gap-16 lg:space-y-0 xl:gap-16">
              <div className="lg:col-span-4 xl:col-span-3">
                {/* Horizontal link menu */}
                <div className="space-y-6">
                  {/* Search Bar */}
                  <Input
                    size="small"
                    icon={<Search />}
                    placeholder="Search..."
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    actions={
                      isSearching && (
                        <span className="mr-1 animate-spin text-white">
                          <Loader />
                        </span>
                      )
                    }
                  />
                  <div className="hidden lg:block">
                    <div className="text-foreground-lighter mb-2 text-sm">Categories</div>
                    <div className="space-y-1">
                      {allCategories.map((category) => (
                        <button
                          key={category}
                          onClick={() => router.push(`#${category.toLowerCase()}`)}
                          className="text-foreground-light block text-base"
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-8 xl:col-span-9">
                {/* Partner Tiles */}
                <div className="grid space-y-10">
                  {partners?.length ? (
                    <TileGrid partners={partners} />
                  ) : (
                    <p className="h2">No Partners Found</p>
                  )}
                </div>
              </div>
            </div>
          </SectionContainer>
        </div>
      </DefaultLayout>
    </>
  )
}

export async function getStaticProps() {
  const { data: partners } = await supabase
    .from('partners')
    .select('*')
    .eq('approved', true)
    .eq('type', 'technology')
    .order('category')
    .order('title')

  return {
    props: {
      partners,
    },
    // TODO: consider using Next.js' On-demand Revalidation with Supabase Database Webhooks instead
    revalidate: 1800, // 30 minutes
  }
}

export default Templates
