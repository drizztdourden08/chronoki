/* @layer root-config @kind config */
import { defineBrockConfig } from '@drizztdourden08/brock-build/config';

export default defineBrockConfig({
  product: {
    id: 'chronoki',
    name: 'ChronoKi',
    appId: 'com.drizztdourden08.chronoki',
    ports: { base: 2010 },
    description: 'A desktop and mobile port of Chrono Trigger. You bring your own ROM.',
    author: { name: 'drizztdourden_', email: 'drizztdourden08@users.noreply.github.com' },
    linuxCategory: 'Game',
    window: { titleBar: { mobile: false } },
    profilesRoute: 'data/profiles',
    artifactPrefix: 'chronoki-',
    dataDirs: ['assets', 'roms', 'profiles', 'config', 'input'],
    icons: { brand: 'chronoki' },
  },
  targets: ['desktop', 'android', 'web'],
  modules: ['display', 'port-kit', 'input'],
});
