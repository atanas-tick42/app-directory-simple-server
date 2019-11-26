export type FDC3AppConfig = {
  appId: string,
  name: string,
  manifest: string
  manifestType: string,
  version?: string,
  title?: string,
  tooltip?: string,
  description?: string,
  images?: AppImage[],
  contactEmail?: string,
  supportEmail?: string,
  publisher?: string,
  icons?: Icon[],
  customConfig? : NameValuePair[],
  intents?: Intent[]
}

type AppImage = {
  url: string
}

type Icon = {
  icon: string
}

type NameValuePair = {
  name: string,
  value: string
}

type Intent = {
  name: string,
  displayName?: string,
  contexts?: string[],
  customConfig?: any
}