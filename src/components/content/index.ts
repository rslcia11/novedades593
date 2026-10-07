/**
 * Componentes disponibles dentro de los archivos MDX sin tener que importarlos.
 * Para agregar uno nuevo: créalo en esta carpeta y regístralo aquí.
 * Docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#custom-components-with-imported-mdx
 */
import AdSlot from '@/components/ads/AdSlot.astro';
import Countdown from '@/components/tools/Countdown.astro';
import DiamondCalculator from '@/components/tools/DiamondCalculator.astro';
import NameGenerator from '@/components/tools/NameGenerator.astro';
import Box from './Box.astro';
import Email from './Email.astro';
import Fact from './Fact.astro';
import Facts from './Facts.astro';
import Format from './Format.astro';
import Formats from './Formats.astro';
import Kpi from './Kpi.astro';
import Kpis from './Kpis.astro';
import Lede from './Lede.astro';
import Note from './Note.astro';
import Pick from './Pick.astro';
import Picks from './Picks.astro';
import Step from './Step.astro';
import Steps from './Steps.astro';
import Tip from './Tip.astro';

export const mdxComponents = {
  AdSlot,
  Box,
  Countdown,
  DiamondCalculator,
  Email,
  Fact,
  Facts,
  Format,
  Formats,
  Kpi,
  Kpis,
  Lede,
  NameGenerator,
  Note,
  Pick,
  Picks,
  Step,
  Steps,
  Tip,
};
