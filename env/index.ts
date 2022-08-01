import prod from './prod.env'
import dev from './dev.env'

export default {
  build: {
    DisableF12: true,
    env: prod,
  },
  dev: {
    env: dev,
    removeElectronJunk: true,
    chineseLog: false,
    port: 3000,
  },
  BuiltInServerPort: 25565
}