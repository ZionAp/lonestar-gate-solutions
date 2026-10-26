import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const areasDir = path.join(root, 'areas');
const siteUrl = 'https://lonestargate.com';
const lastmod = '2026-10-26';

const areas = [
  {
    city: 'Austin',
    slug: 'austin',
    nearby: ['westlake-hills', 'bee-cave', 'manor'],
    intro: `Austin's mix of historic neighborhoods, hillside homes, and fast-growing commercial corridors means every gate faces different demands. From a narrow driveway in Travis Heights to a wide commercial entrance off Burnet Road, we install, repair, automate, and weld gate systems that fit the property and the way people use it.`,
    local: [
      `In older Austin neighborhoods, gates often have to work around mature trees, short driveways, and uneven grade. In newer builds and infill projects, the challenge is usually coordinating a clean modern look with reliable operators, keypads, sensors, and video entry. We size the hardware to the gate and the site instead of forcing a one-size-fits-all package.`,
      `Hill Country views west of MoPac come with slopes, limestone, and wind exposure. We build frames with proper bracing, set posts for the soil and load, and adjust operators so the gate travels smoothly without straining hinges or arms. For commercial properties, we also service high-cycle slide gates, loops, and access control.`
    ],
    issues: `Austin gate calls range from a gate that will not close after a storm to an operator that runs but does not move the gate. Common causes include misaligned hinges, worn rollers, damaged safety sensors, power or battery problems, and control boards that need replacement. We diagnose the actual failure first, then explain repair and replacement options.`,
    faqs: [
      ['Do you repair automatic gates in Austin?', `Yes. We service swing, slide, cantilever, and bi-parting operators, plus keypads, remotes, sensors, and access control. Call with the brand and gate type to speed up the visit.`],
      ['Can you work with HOA or historic rules in Austin?', `We can review gate style, finish, and placement requirements before fabrication, and coordinate measurements so the finished gate meets the property's guidelines.`]
    ],
    areaLine: `We also serve nearby Westlake Hills, Bee Cave, Manor, and communities throughout the Austin metro.`
  },
  {
    city: 'Round Rock',
    slug: 'round-rock',
    nearby: ['cedar-park', 'pflugerville', 'hutto'],
    intro: `Round Rock combines established neighborhoods, growing subdivisions, and busy commercial properties along I-35. That range calls for gate systems that can handle family driveways, HOA entrances, and high-traffic business access without constant adjustments.`,
    local: [
      `In newer Round Rock communities, we often install matching driveway gates and set up keypads, remotes, and safety sensors for daily use. In older parts of town, repairs tend to involve worn hinges, sagging frames, and operators that were sized for a lighter gate. We inspect the whole assembly so a quick fix does not turn into a repeat call.`,
      `The area's summer heat and occasional freezes are hard on batteries, control boards, and exposed metal. We check power, backup batteries, and moving parts, then lubricate and adjust the system for the season. For commercial and HOA properties, we also service telephone entry, vehicle loops, and high-cycle operators.`
    ],
    issues: `A gate that opens halfway, reverses unexpectedly, or stops responding to a remote usually points to a safety device, limit setting, or control issue. We test the operator, sensors, and wiring before recommending parts, and we explain what failed so property owners can avoid the same problem.`,
    faqs: [
      ['Do you install custom driveway gates in Round Rock?', `Yes. We build and install swing, slide, and cantilever gates in steel, aluminum, iron, and cedar to match the property and HOA requirements.`],
      ['Can you repair a gate the same day in Round Rock?', `Same-day service is available for many repairs depending on parts and scheduling. Call (737) 265-4627 and we will check availability for your address.`]
    ],
    areaLine: `We also serve Cedar Park, Pflugerville, Georgetown, Hutto, and nearby Williamson County communities.`
  },
  {
    city: 'Cedar Park',
    slug: 'cedar-park',
    nearby: ['leander', 'round-rock', 'austin'],
    intro: `Cedar Park's mix of master-planned neighborhoods, commercial centers, and Hill Country edges means gate work has to be both precise and durable. We help homeowners and property managers with new installations, automation, repairs, and custom fabrication.`,
    local: [
      `Many Cedar Park properties have decorative driveway gates that need to match stone, stucco, and landscaping. We take measurements on site, confirm swing clearances, and plan the operator and access control so the finished entrance looks intentional rather than added on. For sloped or angled driveways, we adjust the gate and hardware to travel cleanly.`,
      `Newer subdivisions often use shared entrances, keypads, and video entry, while older homes may need hinge repairs, frame straightening, or an operator replacement. We work on both, and we keep common parts and brands in mind so repairs do not drag on. Mobile welding is available for on-site frame and hinge repairs.`
    ],
    issues: `Cedar Park gate problems often show up as a gate that drags, a remote that only works close to the receiver, or an operator that trips a breaker. We check alignment, wiring, power, and safety sensors, then make the repair and retest the full cycle.`,
    faqs: [
      ['Do you service HOA and community gates in Cedar Park?', `Yes. We handle shared entrance gates, telephone entry, loops, keypads, and scheduled maintenance for HOAs and property managers.`],
      ['Can you match an existing gate style?', `We can fabricate or repair gates to match the existing frame, finish, and proportions, subject to safety and operator requirements.`]
    ],
    areaLine: `We also serve Leander, Round Rock, Austin, and surrounding communities.`
  },
  {
    city: 'Pflugerville',
    slug: 'pflugerville',
    nearby: ['hutto', 'manor', 'round-rock'],
    intro: `Pflugerville is growing quickly, with new subdivisions, commercial centers, and larger properties on the edge of town. We install and service gates that keep pace with that growth, from single driveway gates to shared entrances and security gates.`,
    local: [
      `In newer Pflugerville neighborhoods, gates are often part of a larger entrance package with keypads, remotes, and video access. We coordinate the gate, operator, and access control so all the pieces work together. On older properties, we see bent frames, worn rollers, and operators that are near the end of their service life.`,
      `The blackland prairie soil and summer heat can affect post stability and exposed equipment. We check mounting, drainage, and hardware before recommending a repair, and we build reinforcements when a gate needs more support. For businesses, we service slide gates, high-cycle operators, and safety devices.`
    ],
    issues: `When a Pflugerville gate stops working, the cause is often a safety sensor, a limit switch, or a loose connection rather than a failed motor. We test the system in sequence so the repair addresses the real fault and not just the symptom.`,
    faqs: [
      ['Do you install gates for new construction in Pflugerville?', `Yes. We can work with builders, homeowners, and property managers on new gate installations, automation, and access control.`],
      ['Do you offer emergency gate repair in Pflugerville?', `We provide 24/7 emergency service and same-day repairs when scheduling and parts allow.`]
    ],
    areaLine: `We also serve Hutto, Manor, Round Rock, and nearby communities.`
  },
  {
    city: 'Georgetown',
    slug: 'georgetown',
    nearby: ['round-rock', 'leander', 'cedar-park'],
    intro: `Georgetown blends a historic downtown, active-adult communities, and newer neighborhoods spreading west of I-35. Each type of property has different gate needs, from pedestrian-friendly entrances to long driveway gates and commercial access points.`,
    local: [
      `Around the Square and older neighborhoods, gate work often has to respect historic character and tight spaces. We repair and fabricate frames, hinges, and latches with an eye on the existing style. In Sun City and other planned communities, we focus on reliable operators, keypad access, and safety devices that residents can use comfortably.`,
      `West of I-35, larger lots and Hill Country terrain bring longer driveways, slopes, and wind exposure. We size posts and operators for the actual gate load, and we test every cycle after installation. Mobile welding helps when a gate frame or hinge needs attention on site.`
    ],
    issues: `Common Georgetown calls include gates that sag, remotes that stop working, and operators that reverse without warning. We inspect hinges, tracks, sensors, and control settings, then explain whether a repair, rebuild, or replacement makes the most sense.`,
    faqs: [
      ['Do you work on gates in Sun City and Georgetown?', `Yes. We service residential and community gates throughout Georgetown, including active-adult and HOA properties.`],
      ['Can you repair an older gate without replacing it?', `Often, yes. We evaluate the frame, hinges, and operator and recommend repair when the structure is sound enough to support it safely.`]
    ],
    areaLine: `We also serve Round Rock, Leander, Cedar Park, and nearby Williamson County areas.`
  },
  {
    city: 'Leander',
    slug: 'leander',
    nearby: ['cedar-park', 'georgetown', 'round-rock'],
    intro: `Leander sits where Austin's growth meets the Hill Country, with new neighborhoods, large lots, and long views. Gate systems here need to handle sun, wind, and uneven terrain while staying easy for residents and guests to use.`,
    local: [
      `In newer Leander subdivisions, we install driveway gates with keypads, remotes, and safety sensors that fit the home's style. On acreage and custom properties, the gate may be larger, set farther from the house, and exposed to more wind. We plan power, access control, and operator placement early so the system is reliable from day one.`,
      `Limestone, slopes, and long driveways can all affect gate performance. We check post depth and bracing, confirm the gate is square, and adjust the operator for a smooth travel path. When a gate is damaged, mobile welding lets us repair frames and hinges without hauling the gate away.`
    ],
    issues: `Leander gate issues often involve operator limits, battery backup, or a gate that has shifted after heavy rain. We diagnose the cause, correct alignment, and test safety features so the gate does not reverse or stop unexpectedly.`,
    faqs: [
      ['Do you service long driveway gates in Leander?', `Yes. We work on residential and ranch-style gates, including larger frames and remote access systems.`],
      ['Can you add a keypad or remote to an existing gate in Leander?', `We can add or replace access control, remotes, receivers, and keypads, provided the existing operator is compatible and safe to use.`]
    ],
    areaLine: `We also serve Cedar Park, Georgetown, Round Rock, and nearby communities.`
  },
  {
    city: 'Lakeway',
    slug: 'lakeway',
    nearby: ['bee-cave', 'spicewood', 'lago-vista'],
    intro: `Lakeway's lakefront homes, hillside properties, and gated communities put a premium on privacy, security, and curb appeal. We install and service gates that fit the architecture and handle the area's slopes and weather.`,
    local: [
      `Many Lakeway driveways are sloped, curved, or shared, so a gate has to be planned carefully. We check clearance, drainage, and operator placement, then choose hardware that can handle the grade without straining. For gated communities, we also service shared entrances, telephone entry, and access control.`,
      `Lake Travis humidity and sun can wear finishes, batteries, and moving parts. We inspect hinges, rollers, and control boxes, and we recommend maintenance that keeps the gate operating smoothly. When a frame is bent or a hinge fails, mobile welding can often solve the problem on site.`
    ],
    issues: `A Lakeway gate that will not open may have a dead battery, a tripped breaker, a failed sensor, or a control board issue. We test power and safety circuits first, then repair or replace only what is needed.`,
    faqs: [
      ['Do you work on gates in Lakeway gated communities?', `Yes. We service residential gates and shared community entrances, including access control and telephone entry.`],
      ['Can you repair a gate on a sloped driveway?', `Yes. We evaluate the gate, operator, and grade and adjust or repair the system so it travels safely.`]
    ],
    areaLine: `We also serve Bee Cave, Spicewood, Lago Vista, and nearby Lake Travis communities.`
  },
  {
    city: 'Bee Cave',
    slug: 'bee-cave',
    nearby: ['westlake-hills', 'lakeway', 'austin'],
    intro: `Bee Cave combines Hill Country scenery with upscale neighborhoods, gated communities, and busy commercial areas around the Galleria. Gate systems here need to look refined and perform reliably day after day.`,
    local: [
      `On larger Bee Cave lots, gates are often long, decorative, and set back from the road. We plan the operator, power, and access control around the property layout so the entrance works smoothly in daily use. For gated communities and commercial properties, we service shared gates, keypads, loops, and video entry.`,
      `Slopes, limestone, and exposed wind can put extra load on gate hardware. We build frames with proper bracing, set posts for the site, and adjust the operator so the gate does not bind. Mobile welding is available for on-site repairs to frames, hinges, and brackets.`
    ],
    issues: `Bee Cave gate calls often involve a gate that drifts, drags, or fails to latch. We check alignment, hinges, tracks, and sensors, then test the full cycle before leaving. If the operator is outdated, we explain replacement options that fit the existing entrance.`,
    faqs: [
      ['Do you install custom gates in Bee Cave?', `Yes. We build and install gates that match the property's style, from modern aluminum to ornamental steel and cedar.`],
      ['Do you service commercial gates near the Hill Country Galleria?', `Yes. We work on commercial slide and swing gates, access control, and safety devices throughout the Bee Cave area.`]
    ],
    areaLine: `We also serve Austin, Westlake Hills, Lakeway, and nearby Hill Country communities.`
  },
  {
    city: 'Westlake Hills',
    slug: 'westlake-hills',
    nearby: ['austin', 'bee-cave', 'dripping-springs'],
    intro: `Westlake Hills properties are known for privacy, mature trees, and custom architecture. Gates here often need to balance security and curb appeal while fitting strict neighborhood expectations and difficult terrain.`,
    local: [
      `Many Westlake Hills driveways are steep, narrow, or screened by trees, so gate placement and swing clearance matter. We measure the site, plan the operator and access control, and choose finishes that complement stone, stucco, and natural landscaping. For renovations, we can match an existing gate style or rebuild a frame to suit the entrance.`,
      `The area's hills and tree canopy can affect sunlight, moisture, and signal range. We test remotes, keypads, and safety sensors in the actual setting, not just on a bench. When a gate or hinge needs repair, mobile welding keeps the work on site and reduces disruption.`
    ],
    issues: `Westlake Hills gate problems often involve a gate that will not latch, a remote with poor range, or an operator that reverses. We inspect alignment, wiring, sensors, and control settings and recommend the least invasive repair that restores safe operation.`,
    faqs: [
      ['Do you work with strict HOA or city requirements in Westlake Hills?', `We can review gate style, finish, and placement needs and coordinate measurements so the installation fits the property's requirements.`],
      ['Can you repair a heavy custom gate in Westlake Hills?', `Yes. We assess the frame, hinges, and operator and repair or reinforce the system when the structure can safely support it.`]
    ],
    areaLine: `We also serve Austin, Bee Cave, Rollingwood, and nearby communities.`
  },
  {
    city: 'Dripping Springs',
    slug: 'dripping-springs',
    nearby: ['bee-cave', 'spicewood', 'wimberley'],
    intro: `Dripping Springs is the gateway to the Hill Country, with acreage, ranches, wineries, and long private driveways. Gates here often need to handle distance, terrain, and a more rural approach to security.`,
    local: [
      `On larger Dripping Springs properties, a gate may be hundreds of feet from the house and far from convenient power. We plan operator placement, power options, and access control so the entrance is practical, not just attractive. For ranch and estate entrances, we build heavy-duty frames and reinforce hinges for daily use.`,
      `Limestone, slopes, and seasonal rain can shift posts and stress hardware. We set posts for the site, check drainage, and adjust the gate so it travels without binding. Mobile welding is especially useful here for on-site frame repairs and custom brackets.`
    ],
    issues: `Dripping Springs gate calls often involve a gate that will not open from a vehicle, a remote with limited range, or a frame that has shifted after weather. We test the operator, antenna, sensors, and alignment, then repair the underlying cause.`,
    faqs: [
      ['Do you install ranch and driveway gates in Dripping Springs?', `Yes. We build and service gates for rural properties, ranches, and residential driveways.`],
      ['Can you work on gates far from the house?', `Yes. We plan power and access control for long driveways and can recommend options that suit the property.`]
    ],
    areaLine: `We also serve Austin, Bee Cave, Spicewood, Wimberley, and nearby Hill Country communities.`
  },
  {
    city: 'Spicewood',
    slug: 'spicewood',
    nearby: ['lakeway', 'bee-cave', 'dripping-springs'],
    intro: `Spicewood's lakefront homes, ranches, and wooded acreage offer privacy and space, and the gates that protect them have to work in demanding conditions. We install, repair, and automate gates for properties across the Spicewood area.`,
    local: [
      `Long driveways, steep approaches, and limited power access are common in Spicewood. We plan the gate and operator around the site, including battery backup, solar-friendly options, and access control that reaches the entrance. For ranch gates, we build frames that can handle heavy use and exposed weather.`,
      `Lake Travis and the surrounding terrain bring humidity, wind, and shifting soil. We check post stability, hinges, and operator alignment, and we recommend maintenance that prevents small issues from becoming expensive failures. Mobile welding helps with on-site repairs to frames and hardware.`
    ],
    issues: `Spicewood gate problems often show up as a gate that moves slowly, stops halfway, or will not respond to a remote. We inspect the battery, power, limit settings, and sensors before recommending parts.`,
    faqs: [
      ['Do you service remote or rural gates in Spicewood?', `Yes. We work on long-driveway, ranch, and lake-property gates, including access control and backup power options.`],
      ['Can you repair a gate after storm damage in Spicewood?', `Yes. We can straighten or rebuild frames, replace hinges and hardware, and realign the operator when possible.`]
    ],
    areaLine: `We also serve Lakeway, Bee Cave, Dripping Springs, and nearby communities.`
  },
  {
    city: 'Buda',
    slug: 'buda',
    nearby: ['kyle', 'austin', 'del-valle'],
    intro: `Buda has grown from a small town into a busy south-Austin suburb, with new neighborhoods, commercial development, and easy access to outdoor spaces. We help Buda property owners with gate installation, repair, automation, and welding.`,
    local: [
      `In Buda's newer subdivisions, driveway gates and community entrances often include keypads, remotes, and safety sensors. We install systems that fit the home and the HOA, and we make sure the operator is sized for the gate. On older properties, we repair sagging frames, worn hinges, and outdated operators.`,
      `Summer heat, clay soil, and heavy rain can affect posts, wiring, and moving parts. We check alignment and drainage, test safety devices, and adjust the gate for smooth travel. For commercial properties, we service slide gates, access control, and high-cycle operators.`
    ],
    issues: `Common Buda gate issues include a gate that reverses, a remote that works only sometimes, and a gate that drags on the ground. We diagnose the operator, sensors, and hardware and explain the repair before work begins.`,
    faqs: [
      ['Do you install driveway gates in Buda?', `Yes. We install swing, slide, and cantilever gates and can add keypads, remotes, and access control.`],
      ['Do you repair HOA gates in Buda?', `Yes. We service shared entrance gates, telephone entry, loops, and safety devices for HOAs and property managers.`]
    ],
    areaLine: `We also serve Kyle, Austin, Del Valle, and nearby communities.`
  },
  {
    city: 'Kyle',
    slug: 'kyle',
    nearby: ['buda', 'austin', 'del-valle'],
    intro: `Kyle combines a historic downtown with fast-growing neighborhoods along I-35. Gate service here ranges from simple driveway repairs to new automated entrances for homes, HOAs, and businesses.`,
    local: [
      `In newer Kyle neighborhoods, we install gates with matching finishes, keypads, and safety sensors that work for families and guests. On older properties and small acreage, we often repair frames, replace hinges, and update operators that no longer match the gate. We look at the whole system so the repair lasts.`,
      `The area's heat and occasional hard freezes can shorten battery life and stress exposed parts. We test power, backup batteries, and sensors, then adjust the gate for reliable operation. Mobile welding is available for on-site hinge and frame repairs.`
    ],
    issues: `A Kyle gate that will not close may have a misaligned sensor, a limit issue, or a damaged hinge. We check the full cycle and safety circuit, then make the repair and retest.`,
    faqs: [
      ['Do you service residential gates in Kyle?', `Yes. We repair and install driveway gates, operators, keypads, remotes, and safety devices.`],
      ['Can you help with a commercial gate in Kyle?', `Yes. We service commercial swing and slide gates, access control, and high-traffic entrances.`]
    ],
    areaLine: `We also serve Buda, Austin, Del Valle, and nearby communities.`
  },
  {
    city: 'Hutto',
    slug: 'hutto',
    nearby: ['round-rock', 'pflugerville', 'manor'],
    intro: `Hutto has a small-town feel and a growing base of new neighborhoods and businesses. We provide gate installation, repair, and automation for homeowners, HOAs, and commercial properties across the area.`,
    local: [
      `Many Hutto homes are newer, so gate work often focuses on matching the home's style and setting up reliable access control. We install keypads, remotes, and safety sensors and make sure the operator fits the gate. For older properties, we repair frames, hinges, and operators that have reached the end of their service life.`,
      `Heat, wind, and shifting soil can affect gate alignment and post stability. We check the frame, hinges, and operator, and we reinforce or rebuild parts when needed. For community entrances, we also service telephone entry, loops, and shared access.`
    ],
    issues: `Hutto gate calls often involve a gate that will not open, a remote that stops working, or a gate that reverses unexpectedly. We test the power, sensors, and control settings and explain the cause before recommending repairs.`,
    faqs: [
      ['Do you install automatic gates in Hutto?', `Yes. We install and automate driveway gates and can add keypads, remotes, and safety devices.`],
      ['Do you work on HOA gates in Hutto?', `Yes. We service shared community entrances, access control, and scheduled maintenance.`]
    ],
    areaLine: `We also serve Round Rock, Pflugerville, Manor, and nearby communities.`
  },
  {
    city: 'Manor',
    slug: 'manor',
    nearby: ['austin', 'pflugerville', 'hutto'],
    intro: `Manor sits east of Austin where prairie land meets new development. The area's larger lots, new subdivisions, and commercial corridors call for gates that can handle wind, dust, and daily use.`,
    local: [
      `On Manor's newer properties, we install driveway and entrance gates with access control and safety sensors that fit the site. On acreage and older properties, gates may need frame repair, hinge replacement, or a new operator. We inspect the full assembly so the fix addresses the cause, not just the symptom.`,
      `Prairie wind and shifting soil can loosen posts and stress hardware. We check mounting, alignment, and drainage, and we reinforce frames when needed. Mobile welding lets us repair heavy gates on site, which is especially useful for rural and commercial properties.`
    ],
    issues: `A Manor gate that drags, sticks, or fails to latch often has an alignment or hinge problem. We also check sensors, limits, and power so the gate operates safely after the repair.`,
    faqs: [
      ['Do you install gates on acreage in Manor?', `Yes. We work on residential, ranch, and commercial gates, including long driveways and heavy frames.`],
      ['Can you repair a gate after wind damage in Manor?', `Yes. We can straighten or rebuild frames, replace hinges, and realign the operator when the structure allows.`]
    ],
    areaLine: `We also serve Austin, Pflugerville, Hutto, and nearby communities.`
  },
  {
    city: 'Lago Vista',
    slug: 'lago-vista',
    nearby: ['lakeway', 'spicewood', 'bee-cave'],
    intro: `Lago Vista's lake homes, hillside streets, and gated communities demand gate systems that handle slopes, weather, and limited space. We help property owners with new gates, repairs, automation, and access control.`,
    local: [
      `Many Lago Vista driveways climb or curve, so gate placement and swing clearance need careful planning. We measure the site, choose an operator that suits the grade, and set up access control that works from the driveway. For gated communities, we service shared entrances, keypads, and telephone entry.`,
      `Lake humidity, sun, and shifting limestone soil can affect posts, finishes, and electronics. We check alignment, drainage, and battery backup, and we recommend maintenance that keeps the gate moving smoothly. Mobile welding is available for frame and hinge repairs.`
    ],
    issues: `Lago Vista gate problems often involve a gate that stops on a slope, a remote with poor range, or a sensor that triggers at random. We test the operator, safety devices, and wiring, then adjust or repair the system.`,
    faqs: [
      ['Do you service gates on sloped driveways in Lago Vista?', `Yes. We evaluate the grade, gate weight, and operator and adjust the system for safe travel.`],
      ['Do you work on lakefront and gated-community gates in Lago Vista?', `Yes. We service residential gates and shared community entrances.`]
    ],
    areaLine: `We also serve Lakeway, Spicewood, Jonestown, and nearby Lake Travis communities.`
  },
  {
    city: 'Wimberley',
    slug: 'wimberley',
    nearby: ['dripping-springs', 'driftwood', 'spicewood'],
    intro: `Wimberley's Hill Country charm, creek-side properties, and rural acreage make it a unique place to build and maintain gates. We install and service gates that fit the landscape and stand up to the elements.`,
    local: [
      `In Wimberley, driveways can be long, steep, or unpaved, and power may be far from the entrance. We plan the gate, operator, and access control around those conditions, including battery backup where needed. For ranch and estate gates, we build frames that can handle heavy use and exposed weather.`,
      `Creek humidity, limestone, and seasonal rain can affect posts, hinges, and finishes. We check drainage, alignment, and hardware, and we reinforce or rebuild parts when needed. Mobile welding is especially useful for on-site repairs in rural areas.`
    ],
    issues: `Wimberley gate calls often involve a gate that will not open from the road, a frame that has shifted, or an operator that struggles on a slope. We inspect the full system and explain whether a repair or replacement is the better value.`,
    faqs: [
      ['Do you install ranch gates in Wimberley?', `Yes. We build and service gates for rural properties, ranches, and Hill Country homes.`],
      ['Can you repair a gate on a long driveway in Wimberley?', `Yes. We service remote entrances and can recommend power and access control options that fit the property.`]
    ],
    areaLine: `We also serve Dripping Springs, Driftwood, Spicewood, and nearby Hill Country communities.`
  },
  {
    city: 'Driftwood',
    slug: 'driftwood',
    nearby: ['dripping-springs', 'wimberley', 'austin'],
    intro: `Driftwood is wide-open ranch country with long driveways, large properties, and a strong sense of privacy. Gates here need to be sturdy, secure, and suited to a rural setting.`,
    local: [
      `On Driftwood acreage, a gate may be the first thing visitors see and the main point of access for the property. We build heavy-duty frames, plan operator placement, and set up access control that works over long distances. For ranch entrances, we also repair and reinforce existing gates rather than automatically replacing them.`,
      `Limestone soil, wind, and seasonal rain can shift posts and stress hinges. We check mounting, alignment, and drainage, and we adjust the gate so it travels without binding. Mobile welding allows us to repair frames and brackets on site.`
    ],
    issues: `Driftwood gate issues often include a gate that will not latch, a remote that works only near the house, or a frame that has moved after weather. We diagnose the operator, antenna, sensors, and alignment and recommend the right fix.`,
    faqs: [
      ['Do you build custom ranch gates in Driftwood?', `Yes. We fabricate and install gates for ranches, estates, and rural driveways.`],
      ['Can you improve remote range on a long driveway in Driftwood?', `Yes. We can test and upgrade receivers, antennas, and access control to suit the property.`]
    ],
    areaLine: `We also serve Dripping Springs, Wimberley, Austin, and nearby communities.`
  },
  {
    city: 'Del Valle',
    slug: 'del-valle',
    nearby: ['austin', 'manor', 'buda'],
    intro: `Del Valle stretches southeast of Austin along the Colorado River, with a mix of farmland, new development, and industrial property. Gate needs here range from residential driveways to security entrances and commercial access points.`,
    local: [
      `In Del Valle's newer neighborhoods, we install gates with keypads, remotes, and safety sensors that fit the home. On larger and commercial properties, we service heavy slide gates, access control, and high-cycle operators. The area's flat terrain can make drainage and soil stability important, so we check those before installation.`,
      `Heat, dust, and seasonal flooding can affect posts, wiring, and moving parts. We test power, sensors, and alignment, and we recommend maintenance that keeps the gate operating reliably. Mobile welding is available for on-site frame and hinge repairs.`
    ],
    issues: `Del Valle gate calls often involve a gate that will not open, a sensor that keeps tripping, or a frame that has shifted. We inspect the full system and explain the repair options.`,
    faqs: [
      ['Do you service commercial gates in Del Valle?', `Yes. We work on commercial swing and slide gates, access control, and high-traffic entrances.`],
      ['Do you install driveway gates in Del Valle?', `Yes. We install and automate residential gates and can add keypads, remotes, and safety devices.`]
    ],
    areaLine: `We also serve Austin, Manor, Buda, and nearby communities.`
  },
  {
    city: 'Jollyville',
    slug: 'jollyville',
    nearby: ['austin', 'round-rock', 'cedar-park'],
    intro: `Jollyville is an established area in northwest Austin with mature neighborhoods, busy roads, and a mix of older and updated homes. We provide gate repair, installation, and automation for properties that need dependable daily access.`,
    local: [
      `Many Jollyville homes have mature trees, shorter driveways, and older gate systems that need attention. We repair hinges, frames, and operators, and we update access control when remotes or keypads become unreliable. For newer renovations, we can install a gate that fits the home without overwhelming the entrance.`,
      `Tree cover, shifting soil, and summer heat can affect alignment and electronics. We test the full cycle, check sensors and wiring, and adjust the gate so it does not drag or reverse. Mobile welding is available for on-site repairs when a frame or hinge is damaged.`
    ],
    issues: `Jollyville gate problems often involve a gate that will not close, a remote with short range, or an operator that trips. We diagnose the cause and recommend a repair that fits the age and condition of the system.`,
    faqs: [
      ['Do you repair older gates in Jollyville?', `Yes. We work on older frames, hinges, and operators and can recommend repair or replacement based on condition.`],
      ['Can you add access control to an existing gate in Jollyville?', `We can add or replace keypads, remotes, receivers, and entry systems when the operator is compatible.`]
    ],
    areaLine: `We also serve Austin, Round Rock, Cedar Park, and nearby communities.`
  }
];

const bySlug = new Map(areas.map(area => [area.slug, area]));

const escapeHtml = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const icon = (name, className = 'icon') =>
  `<svg class="${className}" aria-hidden="true"><use href="#icon-${name}"></use></svg>`;

const phoneHtml = '(737)&nbsp;265&#8209;4627';
const phoneHref = 'tel:+17372654627';

const indexHtml = await fs.readFile(path.join(root, 'index.html'), 'utf8');
const spriteMatch = indexHtml.match(/<svg class="icon-sprite"[\s\S]*?<\/svg>/);
if (!spriteMatch) throw new Error('Could not find the shared icon sprite in index.html');
const sprite = spriteMatch[0];

function header() {
  return `${sprite}

    <a class="skip-link" href="#main">Skip to main content</a>

    <!-- Header -->
    <header class="header">
        <div class="texas-ribbon" aria-hidden="true">
            <span class="texas-ribbon-blue"></span>
            <span class="texas-ribbon-star">${icon('star')}</span>
            <span class="texas-ribbon-red"></span>
        </div>
        <div class="top-bar">
            <div class="container">
                <div class="top-bar-content">
                <div class="top-bar-left">
                    <span>${icon('star')} Deep in the Heart of Texas</span>
                    <span>${icon('map-marker-alt')} Serving Austin, TX &amp; Surrounding Areas</span>
                    <span>${icon('clock')} Mon-Fri 8AM-6PM | 24/7 Emergency Service</span>
                </div>
                <div class="top-bar-right">
                    <span class="top-bar-mobile-location">${icon('map-marker-alt')} Austin, TX</span>
                    <a class="top-bar-phone" href="${phoneHref}">${icon('phone')} ${phoneHtml}</a>
                </div>
                </div>
            </div>
        </div>

        <nav class="nav" aria-label="Main navigation">
            <div class="container">
                <div class="nav-content">
                <a class="nav-logo" href="../index.html" aria-label="LoneStar Gate Solutions home">
                    <span class="logo-mark" aria-hidden="true">
                        <svg viewBox="0 0 48 48" role="presentation" focusable="false">
                            <defs>
                                <linearGradient id="logoStar" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0" stop-color="#E8744F"/>
                                    <stop offset="1" stop-color="#B8860B"/>
                                </linearGradient>
                            </defs>
                            <rect class="logo-mark-frame" x="3" y="3" width="42" height="42" rx="10"/>
                            <path class="logo-mark-gate" d="M14 34V19l5-4 5 4v15M24 34V19l5-4 5 4v15"/>
                            <path class="logo-mark-star" d="M24 11l1.6 3.6 3.9.4-2.9 2.6.8 3.8-3.4-1.9-3.4 1.9.8-3.8-2.9-2.6 3.9-.4z" fill="url(#logoStar)"/>
                        </svg>
                    </span>
                    <span class="logo-text">
                        <span class="logo-name">Lone<span class="accent">Star</span></span>
                        <span class="logo-tagline">Gate Solutions</span>
                    </span>
                </a>
                    <button class="nav-toggle" id="navToggle" type="button" aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="navMenu">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                    <ul class="nav-menu" id="navMenu">
                        <li><a href="../index.html#home" class="nav-link">Home</a></li>
                        <li><a href="../index.html#services" class="nav-link">Services</a></li>
                        <li><a href="index.html" class="nav-link active" aria-current="page">Service Areas</a></li>
                        <li><a href="../index.html#gallery" class="nav-link">Gallery</a></li>
                        <li><a href="../index.html#advantage" class="nav-link">Why Us</a></li>
                        <li><a href="../index.html#faqs" class="nav-link">FAQ</a></li>
                        <li><a href="../index.html#about" class="nav-link">About</a></li>
                        <li><a href="../index.html#contact" class="nav-link">Contact</a></li>
                        <li class="nav-cta"><a href="${phoneHref}" class="btn btn-primary">${icon('phone')} Call&nbsp;Now</a></li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>`;
}

const areaFooterLinks = [
  ['austin', 'Austin, TX'],
  ['round-rock', 'Round Rock'],
  ['cedar-park', 'Cedar Park'],
  ['lakeway', 'Lakeway'],
  ['dripping-springs', 'Dripping Springs']
].map(([slug, label]) => `<li><a href="${slug}.html">${label}</a></li>`).join('\n                        ');

function footer() {
  return `<footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <div class="footer-logo">
                        <span class="logo-mark logo-mark--sm" aria-hidden="true">
                            <svg viewBox="0 0 48 48" role="presentation" focusable="false">
                                <defs>
                                    <linearGradient id="logoStarFooter" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0" stop-color="#E8744F"/>
                                        <stop offset="1" stop-color="#B8860B"/>
                                    </linearGradient>
                                </defs>
                                <rect class="logo-mark-frame" x="3" y="3" width="42" height="42" rx="10"/>
                                <path class="logo-mark-gate" d="M14 34V19l5-4 5 4v15M24 34V19l5-4 5 4v15"/>
                                <path class="logo-mark-star" d="M24 11l1.6 3.6 3.9.4-2.9 2.6.8 3.8-3.4-1.9-3.4 1.9.8-3.8-2.9-2.6 3.9-.4z" fill="url(#logoStarFooter)"/>
                            </svg>
                        </span>
                        <span class="logo-text">
                            <span class="logo-name">Lone<span class="accent">Star</span></span>
                            <span class="logo-tagline">Gate Solutions</span>
                        </span>
                    </div>
                    <p>Austin gate installation, repair, sales &amp; welding company. Quality craftsmanship, reliable service.</p>
                    <div class="footer-social">
                        <a href="https://www.facebook.com/lonestargatesolutions" target="_blank" rel="noopener noreferrer" aria-label="LoneStar Gate Solutions on Facebook">${icon('facebook')}</a>
                        <a href="https://www.instagram.com/lonestargatesolutions" target="_blank" rel="noopener noreferrer" aria-label="LoneStar Gate Solutions on Instagram">${icon('instagram')}</a>
                        <a href="https://www.google.com/maps/place/LoneStar+Gate+Solutions" target="_blank" rel="noopener noreferrer" aria-label="LoneStar Gate Solutions on Google">${icon('google')}</a>
                    </div>
                </div>

                <div class="footer-section">
                    <h4>Services</h4>
                    <ul>
                        <li><a href="../index.html#services">Gate Installation</a></li>
                        <li><a href="../index.html#services">Gate Repair</a></li>
                        <li><a href="../index.html#services">Gate Sales &amp; Equipment</a></li>
                        <li><a href="../index.html#services">Access Control Systems</a></li>
                        <li><a href="../index.html#services">Welding &amp; Fabrication</a></li>
                    </ul>
                </div>

                <div class="footer-section">
                    <h4>Service Areas</h4>
                    <ul>
                        ${areaFooterLinks}
                        <li><a href="index.html">All Service Areas</a></li>
                    </ul>
                </div>

                <div class="footer-section">
                    <h4>Contact Info</h4>
                    <ul class="footer-contact">
                        <li>${icon('phone')} <a href="${phoneHref}">${phoneHtml}</a></li>
                        <li>${icon('envelope')} <a href="mailto:lonestargatesrepair@gmail.com">lonestargatesrepair@gmail.com</a></li>
                        <li>${icon('map-marker-alt')} Austin, TX &amp; Surrounding Areas</li>
                        <li>${icon('clock')} Mon-Fri 8AM-6PM | Sat 9AM-4PM</li>
                    </ul>
                </div>
            </div>

            <div class="footer-bottom">
                <p class="footer-texas">${icon('star')} Proudly Serving Texas ${icon('star')}</p>
                <p class="footer-bless">${icon('flag-usa')} God Bless America &middot; God Bless Texas ${icon('star')}</p>
                <p>&copy; <span id="year">2026</span> LoneStar Gate Solutions. All rights reserved. | Licensed &amp; Insured</p>
            </div>
        </div>
    </footer>

    <!-- Mobile Call Bar -->
    <div class="mobile-call-bar">
        <a href="${phoneHref}" class="mobile-call-link">
            ${icon('phone')} Call&nbsp;Now
        </a>
        <a href="../index.html#contact" class="mobile-call-link mobile-call-link--alt">
            ${icon('clipboard-list')} Free Quote
        </a>
    </div>

    <script src="../js/main.js"></script>`;
}

function documentHead({ title, description, canonical, jsonLd }) {
  const schema = jsonLd.map(item => `<script type="application/ld+json">\n${JSON.stringify(item, null, 2)}\n    </script>`).join('\n    ');
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <link rel="canonical" href="${canonical}">
    <meta name="robots" content="index, follow">
    <meta name="theme-color" content="#101820">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="LoneStar Gate Solutions">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="${siteUrl}/images/og-image.jpg">
    <meta property="og:image:alt" content="LoneStar Gate Solutions custom gate installation and repair in Central Texas">
    <meta property="og:locale" content="en_US">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(description)}">
    <meta name="twitter:image" content="${siteUrl}/images/og-image.jpg">
    <link rel="icon" type="image/png" href="../images/favicon.png">
    <link rel="apple-touch-icon" href="../images/apple-touch-icon.png">
    <link rel="preload" as="font" type="font/woff2" href="../fonts/inter-latin.woff2" crossorigin>
    <link rel="preload" as="font" type="font/woff2" href="../fonts/plus-jakarta-sans-latin.woff2" crossorigin>
    <link rel="stylesheet" href="../css/style.css">
    ${schema}
</head>`;
}

function breadcrumbs(items) {
  return `<nav class="breadcrumbs" aria-label="Breadcrumb">
                <ol>
                    ${items.map(item => item.url
    ? `<li><a href="${item.url}">${item.label}</a></li>`
    : `<li aria-current="page">${item.label}</li>`).join('\n                    ')}
                </ol>
            </nav>`;
}

function quoteButtons() {
  return `<div class="hero-cta">
                        <a href="${phoneHref}" class="btn btn-primary btn-large">${icon('phone')} Call&nbsp;${phoneHtml}</a>
                        <a href="../index.html#contact" class="btn btn-secondary btn-large">${icon('clipboard-list')} Request a Free Quote</a>
                    </div>`;
}

function trustRow() {
  return `<div class="hero-trust">
                        <span class="trust-item">${icon('shield-alt')} Licensed &amp; Insured</span>
                        <span class="trust-item">${icon('check')} 1-Year Labor Warranty</span>
                        <span class="trust-item">${icon('clock')} 24/7 Emergency Service</span>
                    </div>`;
}

function sidebar(area) {
  const nearbyLinks = area.nearby.map(slug => {
    const nearby = bySlug.get(slug);
    return `<li><a href="${nearby.slug}.html">${nearby.city} gate service</a></li>`;
  }).join('\n                        ');

  return `<aside class="area-sidebar" aria-label="Gate service information for ${area.city}">
                <div class="sidebar-card sidebar-card--accent">
                    <h2>Get a gate quote in ${area.city}</h2>
                    <p>Tell us about the gate, operator, or access issue. We will confirm availability and the next step.</p>
                    <a href="${phoneHref}" class="btn btn-primary btn-full">${icon('phone')} Call&nbsp;${phoneHtml}</a>
                    <a href="../index.html#contact" class="btn btn-secondary btn-full">Request a Quote</a>
                </div>
                <div class="sidebar-card">
                    <h2>Gate services</h2>
                    <ul>
                        <li><a href="../index.html#services">Gate installation</a></li>
                        <li><a href="../index.html#services">Gate repair</a></li>
                        <li><a href="../index.html#services">Automatic gate operators</a></li>
                        <li><a href="../index.html#services">Access control</a></li>
                        <li><a href="../index.html#services">Mobile welding</a></li>
                    </ul>
                </div>
                <div class="sidebar-card">
                    <h2>Nearby service areas</h2>
                    <ul>
                        ${nearbyLinks}
                        <li><a href="index.html">All Central Texas areas</a></li>
                    </ul>
                </div>
                <div class="sidebar-card">
                    <h2>Service hours</h2>
                    <p>Mon-Fri 8AM-6PM<br>Sat 9AM-4PM<br>24/7 emergency service</p>
                </div>
            </aside>`;
}

function cta(area) {
  return `<section class="cta-section">
        <div class="container cta-content">
            <p class="cta-star">${icon('star')}</p>
            <h2>Need gate service in ${area.city}?</h2>
            <p>Call&nbsp;${phoneHtml} for a free quote, or send a request through our contact form. We will follow up with availability and next steps.</p>
            <div class="cta-buttons">
                <a href="${phoneHref}" class="btn btn-primary btn-large">${icon('phone')} Call&nbsp;${phoneHtml}</a>
                <a href="../index.html#contact" class="btn btn-secondary btn-large">${icon('paper-plane')} Request a Free Quote</a>
            </div>
        </div>
    </section>`;
}

function serviceSchema(area, canonical) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Gate installation, repair and welding in ${area.city}, TX`,
    serviceType: [
      'Gate installation',
      'Gate repair',
      'Automatic gate repair',
      'Gate welding and fabrication',
      'Gate access control'
    ],
    provider: {
      '@type': 'LocalBusiness',
      name: 'LoneStar Gate Solutions',
      url: siteUrl,
      telephone: '+17372654627',
      email: 'lonestargatesrepair@gmail.com',
      image: `${siteUrl}/images/og-image.jpg`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Austin',
        addressRegion: 'TX',
        addressCountry: 'US'
      }
    },
    areaServed: {
      '@type': 'City',
      name: `${area.city}, TX`
    },
    url: canonical
  };
}

function breadcrumbSchema(area, canonical) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${siteUrl}/`
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Service Areas',
        item: `${siteUrl}/areas/`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: area.city,
        item: canonical
      }
    ]
  };
}

function faqSchema(area) {
  const questions = [
    ...area.faqs,
    [`Do you offer same-day or emergency gate service in ${area.city}?`, `Same-day service is available for many repairs, and we provide 24/7 emergency service. Call (737) 265-4627 to check availability for your address.`]
  ];
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer
      }
    }))
  };
}

function renderCity(area) {
  const canonical = `${siteUrl}/areas/${area.slug}.html`;
  const title = `Gate Repair in ${area.city}, TX | LoneStar`;
  const description = `Gate repair, installation, automation and welding in ${area.city}, TX. Licensed, insured, 1-year labor warranty. Call (737) 265-4627 for a quote.`;

  const article = `<article class="prose">
                    <h2>Local gate service built for ${area.city}</h2>
                    ${area.local.map(paragraph => `<p>${paragraph}</p>`).join('\n                    ')}

                    <h2>Gate services we provide in ${area.city}</h2>
                    <p>From a single driveway gate to a full commercial entrance, we handle the gate, operator, power, and access control as one system.</p>
                    <ul class="area-service-list">
                        <li><strong>Gate installation:</strong> custom swing, slide, cantilever, and bi-parting gates built for your entrance.</li>
                        <li><strong>Gate repair:</strong> hinges, frames, rollers, tracks, operators, sensors, and control boards.</li>
                        <li><strong>Automation and access control:</strong> keypads, remotes, telephone entry, video intercom, loops, and safety devices.</li>
                        <li><strong>Welding and fabrication:</strong> on-site repairs, custom brackets, hinge fabrication, and frame reinforcement.</li>
                        <li><strong>Maintenance:</strong> seasonal inspections, lubrication, battery checks, and adjustment for reliable operation.</li>
                    </ul>

                    <h2>Common gate problems in ${area.city}</h2>
                    <p>${area.issues}</p>
                    <ul class="area-check-list">
                        <li>Gate alignment, hinges, rollers, and track</li>
                        <li>Operator power, battery backup, and control settings</li>
                        <li>Safety sensors, loops, and reversing behavior</li>
                        <li>Frame welds, posts, and mounting hardware</li>
                    </ul>

                    <h2>What to expect on a ${area.city} gate service call</h2>
                    <p>Every visit starts with a conversation about how the gate is used, what changed, and whether the problem is intermittent. We inspect the gate, operator, power, wiring, and safety devices, then test the full cycle before recommending work. You get a clear explanation of the repair, the parts involved, and the expected cost before we begin. After the repair, we check hinges, alignment, limits, and reversing behavior, and we walk through the operation with you. If a replacement is the better value, we say so and outline the options rather than pushing unnecessary work.</p>

                    <h2>Why ${area.city} property owners call LoneStar</h2>
                    <p>We are licensed, bonded, and insured, and our work includes a 1-year labor warranty plus the manufacturer warranty on operators and equipment. We diagnose the problem before quoting repairs, explain the options in plain language, and test the gate after every job. That approach keeps small issues from turning into repeat calls.</p>

                    <h2>Gate service near ${area.city}</h2>
                    <p>${area.areaLine} If your community is not listed, call us - we may still be able to help.</p>

                    <h2>${area.city} gate service FAQs</h2>
                    <details class="faq-item">
                        <summary>${area.faqs[0][0]}</summary>
                        <p>${area.faqs[0][1]}</p>
                    </details>
                    <details class="faq-item">
                        <summary>${area.faqs[1][0]}</summary>
                        <p>${area.faqs[1][1]}</p>
                    </details>
                    <details class="faq-item">
                        <summary>Do you offer same-day or emergency gate service in ${area.city}?</summary>
                        <p>Same-day service is available for many repairs, and we provide 24/7 emergency service. Call&nbsp;${phoneHtml} to check availability for your address.</p>
                    </details>
                </article>`;

  const jsonLd = [serviceSchema(area, canonical), breadcrumbSchema(area, canonical), faqSchema(area)];

  return `${documentHead({ title, description, canonical, jsonLd })}
<body>
    ${header()}

    <main id="main">
        <section class="page-hero">
            <div class="container">
                ${breadcrumbs([
    { url: '../index.html', label: 'Home' },
    { url: 'index.html', label: 'Service Areas' },
    { label: area.city }
  ])}
                <p class="page-kicker">${icon('map-marker-alt')} ${area.city} Service Area</p>
                <h1 class="hero-title">Gate Installation, Repair &amp; Welding in ${area.city}, TX</h1>
                <p class="hero-subtitle">${area.intro}</p>
                ${quoteButtons()}
                ${trustRow()}
            </div>
        </section>

        <section class="area-article">
            <div class="container article-wrap">
                ${article}
                ${sidebar(area)}
            </div>
        </section>

        ${cta(area)}
    </main>

    ${footer()}
</body>
</html>
`;
}

function renderHub() {
  const canonical = `${siteUrl}/areas/`;
  const title = 'Gate Service Areas | LoneStar Gate Solutions';
  const description = 'Gate installation, repair, automation and welding across Austin and Central Texas. Find your city guide and call (737) 265-4627 for a free quote.';
  const cards = areas.map(area => {
    const excerpt = area.intro.split(/\s+/).slice(0, 22).join(' ');
    return `<article class="area-card">
                    <p class="area-card-kicker">${icon('map-marker-alt')} ${area.city}, TX</p>
                    <h2><a href="${area.slug}.html">${area.city} gate service</a></h2>
                    <p>${excerpt}...</p>
                    <a class="area-card-link" href="${area.slug}.html">Read the ${area.city} guide ${icon('arrow-right')}</a>
                </article>`;
  }).join('\n                ');

  const jsonLd = [{
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Gate Service Areas in Central Texas',
    url: canonical,
    description,
    isPartOf: {
      '@type': 'WebSite',
      name: 'LoneStar Gate Solutions',
      url: siteUrl
    },
    about: {
      '@type': 'LocalBusiness',
      name: 'LoneStar Gate Solutions',
      telephone: '+17372654627',
      url: siteUrl
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: areas.map((area, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: `${area.city} gate service`,
        url: `${siteUrl}/areas/${area.slug}.html`
      }))
    }
  }, {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${siteUrl}/`
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Service Areas',
        item: canonical
      }
    ]
  }];

  return `${documentHead({ title, description, canonical, jsonLd })}
<body>
    ${header()}

    <main id="main">
        <section class="page-hero">
            <div class="container">
                ${breadcrumbs([
    { url: '../index.html', label: 'Home' },
    { label: 'Service Areas' }
  ])}
                <p class="page-kicker">${icon('map-marker-alt')} Austin and Central Texas</p>
                <h1 class="hero-title">Gate Installation &amp; Repair Across Central Texas</h1>
                <p class="hero-subtitle">LoneStar Gate Solutions serves Austin and 19 surrounding communities with custom gate installation, automatic gate repair, access control, mobile welding, and maintenance. Choose your city for local terrain, driveway, and gate-system guidance.</p>
                ${quoteButtons()}
                ${trustRow()}
            </div>
        </section>

        <section class="area-article">
            <div class="container">
                <div class="section-header section-header--left">
                    <h2 class="section-title">Find your city</h2>
                    <p class="section-subtitle">Each guide covers the gate services, common problems, and local conditions we see in that community.</p>
                </div>
                <div class="area-grid">
                ${cards}
                </div>
            </div>
        </section>

        <section class="area-article area-article--alt">
            <div class="container">
                <div class="section-header section-header--left">
                    <h2 class="section-title">What every city guide covers</h2>
                </div>
                <div class="area-info-grid">
                    <div class="area-info-card">
                        <p class="area-info-icon">${icon('tools')}</p>
                        <h3>Installation and fabrication</h3>
                        <p>Custom swing, slide, cantilever, and bi-parting gates in steel, aluminum, iron, and cedar, built for the entrance and the property's style.</p>
                    </div>
                    <div class="area-info-card">
                        <p class="area-info-icon">${icon('wrench')}</p>
                        <h3>Repair and automation</h3>
                        <p>Hinge, frame, roller, track, sensor, control board, and operator repairs, plus new automation and backup power options.</p>
                    </div>
                    <div class="area-info-card">
                        <p class="area-info-icon">${icon('key')}</p>
                        <h3>Access control and welding</h3>
                        <p>Keypads, remotes, telephone entry, video intercom, loops, mobile welding, custom brackets, and structural reinforcement.</p>
                    </div>
                </div>
                <div class="area-hub-note">
                    <p>Not sure which guide fits your property? Call&nbsp;${phoneHtml} or use the contact form. We serve homeowners, HOAs, builders, ranchers, and commercial property managers throughout the Austin metro and Hill Country.</p>
                    <a class="btn btn-primary" href="${phoneHref}">${icon('phone')} Call&nbsp;${phoneHtml}</a>
                </div>
            </div>
        </section>

        <section class="cta-section">
            <div class="container cta-content">
                <p class="cta-star">${icon('star')}</p>
                <h2>One team for gates, access, and welding</h2>
                <p>From a stuck driveway gate to a new automated entrance, we diagnose the system, explain the options, and test the finished work. Call&nbsp;${phoneHtml} to get started.</p>
                <div class="cta-buttons">
                    <a href="${phoneHref}" class="btn btn-primary btn-large">${icon('phone')} Call&nbsp;${phoneHtml}</a>
                    <a href="../index.html#contact" class="btn btn-secondary btn-large">${icon('paper-plane')} Request a Free Quote</a>
                </div>
            </div>
        </section>
    </main>

    ${footer()}
</body>
</html>
`;
}

function countWords(html) {
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-zA-Z#0-9]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text ? text.split(' ').length : 0;
}

await fs.mkdir(areasDir, { recursive: true });

let failures = 0;
for (const area of areas) {
  const html = renderCity(area);
  const articleMatch = html.match(/<article class="prose">([\s\S]*?)<\/article>/);
  const words = countWords(articleMatch ? articleMatch[1] : '');
  console.log(`${area.city}: ${words} words`);
  if (words < 500 || words > 700) {
    console.error(`  ERROR: ${area.city} article is outside the 500-700 word range`);
    failures += 1;
  }
  await fs.writeFile(path.join(areasDir, `${area.slug}.html`), html, 'utf8');
}

await fs.writeFile(path.join(areasDir, 'index.html'), renderHub(), 'utf8');
console.log('Generated areas/index.html and 20 city pages.');
if (failures) process.exitCode = 1;
