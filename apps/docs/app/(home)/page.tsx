import Link from 'next/link'
import { GlassPanel, IconBackground, IconPanel, TextLink } from 'ui'
import {
  additionalResources,
  clientLibraries,
  migrationGuides,
  products,
  selfHostingOptions,
} from './data'
import HomeMenuIconPicker from '~/components/Navigation/NavigationMenu/HomeMenuIconPicker'
import { Hero } from './Hero'

export default function Home() {
  return (
    <>
      <Hero />
      <div className="max-w-7xl px-5 mx-auto py-16">
        <div className="relative transition-all ease-out duration-150">
          <article className="prose max-w-none">
            <div className="flex flex-col">
              <Products />
              <ClientLibraries />
              <MigrateToSupabase />
              <AdditionalResources />
              <SelfHosting />
            </div>
          </article>
        </div>
      </div>
    </>
  )
}

function Products() {
  return (
    <>
      <div className="max-w-xl">
        <h2>Products</h2>
      </div>

      <div className="grid grid-cols-12 gap-6 not-prose [&_svg]:text-brand-600">
        {products.map((product) => {
          return (
            <Link
              href={product.href}
              key={product.title}
              passHref
              className={'col-span-12 md:col-span-4'}
            >
              <GlassPanel
                {...product}
                icon={<HomeMenuIconPicker icon={product.icon} width={18} height={18} />}
                background={true}
                showIconBg={true}
                showLink={false}
              >
                {product.description}
              </GlassPanel>
            </Link>
          )
        })}
      </div>
    </>
  )
}

function ClientLibraries() {
  return (
    <div className="flex flex-col lg:grid grid-cols-12 gap-6 py-12 border-b">
      <div className="col-span-4">
        <div className="md:max-w-xs 2xl:max-w-none">
          <div className="flex items-center gap-3 mb-3 text-brand-600">
            <IconBackground>
              <HomeMenuIconPicker icon="reference-cli" width={18} height={18} />
            </IconBackground>
            <h2 className="m-0">Client Libraries</h2>
          </div>
        </div>
      </div>
      <div className="grid col-span-8 grid-cols-12 gap-6 not-prose">
        {clientLibraries.map((product) => {
          return (
            <Link
              href={product.href}
              key={product.title}
              passHref
              className={'col-span-6 md:col-span-4'}
            >
              <IconPanel
                {...product}
                icon={<HomeMenuIconPicker icon={product.icon} width={18} height={18} />}
                background={true}
                showLink={false}
              ></IconPanel>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function MigrateToSupabase() {
  return (
    <div className="flex flex-col lg:grid grid-cols-12 gap-6 py-12 border-b">
      <div className="col-span-4 flex flex-col gap-1">
        <h2 className="m-0">Migrate to Supabase</h2>
        <p className="text-foreground-light text-sm p-0 m-0">
          Bring your existing data, auth and storage to Supabase following our migration guides.
        </p>
        <TextLink
          label="Explore more resources"
          url="/guides/resources"
          className="no-underline text-brand text-sm"
        />
      </div>

      <div className="grid col-span-8 grid-cols-12 gap-6 not-prose">
        {migrationGuides.map((product) => {
          return (
            <Link
              href={product.href}
              key={product.title}
              className={'col-span-6 md:col-span-4'}
              passHref
            >
              <IconPanel {...product} background={true} showLink={false}></IconPanel>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function AdditionalResources() {
  return (
    <div className="flex flex-col gap-6 py-12 border-b">
      <h3 className="m-0">Additional resources</h3>
      <div className="grid grid-cols-12 gap-6 not-prose">
        {additionalResources.map((product) => {
          return (
            <Link
              href={product.href}
              key={product.title}
              className={'col-span-12 md:col-span-6 lg:col-span-3'}
              passHref
            >
              <GlassPanel
                {...product}
                icon={<HomeMenuIconPicker icon={product.icon} width={18} height={18} />}
                background={false}
              >
                {product.description}
              </GlassPanel>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function SelfHosting() {
  return (
    <div className="flex flex-col lg:grid grid-cols-12 gap-6 py-12">
      <div className="col-span-4 flex flex-col gap-1">
        <div className="md:max-w-xs 2xl:max-w-none">
          <div className="flex items-center gap-3 mb-3 text-brand-600">
            <IconBackground>
              <HomeMenuIconPicker icon="self-hosting" width={18} height={18} />
            </IconBackground>
            <h3 className="m-0">Self-Hosting</h3>
          </div>
          <p className="text-foreground-light text-sm">Get started with self-hosting Supabase.</p>
          <TextLink
            label="More on Self-Hosting"
            url="/guides/self-hosting"
            className="no-underline text-brand text-sm"
          />
        </div>
      </div>

      <div className="grid col-span-8 grid-cols-12 gap-6 not-prose">
        <div className="col-span-full lg:col-span-8 grid grid-cols-12 gap-6">
          {selfHostingOptions.map((product) => {
            return (
              <Link href={product.href} key={product.title} className={'col-span-6'} passHref>
                <IconPanel
                  {...product}
                  icon={<HomeMenuIconPicker icon={product.icon} width={18} height={18} />}
                  background={true}
                  showLink={false}
                ></IconPanel>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
