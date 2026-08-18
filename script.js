document.addEventListener('DOMContentLoaded', () => {
  // 1. Loader Exit Logic
  const loader = document.getElementById('pageLoader');
  
  setTimeout(() => {
    if (loader) {
      loader.classList.add('hidden');
      setTimeout(() => {
        loader.style.display = 'none';
      }, 800);
    }
  }, 2800);

  // 2. Custom Cursor Tracking
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');

  if (cursorDot && cursorRing) {
    window.addEventListener('mousemove', (e) => {
      const { clientX: x, clientY: y } = e;
      cursorDot.style.transform = `translate(${x}px, ${y}px)`;
      cursorRing.style.transform = `translate(${x}px, ${y}px)`;
    });

    const interactiveElements = document.querySelectorAll('button, a, .hotspot, .mac-folder, .mac-dock__icon');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('is-active'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('is-active'));
    });
  }

  // Live Time Updater for macOS Menu Bar
  function updateMacTime() {
    const timeEl = document.getElementById('macDateTime');
    if (timeEl) {
      const now = new Date();
      const options = { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true };
      timeEl.textContent = now.toLocaleString('en-US', options).replace(',', '');
    }
  }
  updateMacTime();
  setInterval(updateMacTime, 30000);

  // 3. Modal / Panel Handlers
  const overlay = document.getElementById('overlay');
  const overlayBackdrop = document.getElementById('overlayBackdrop');
  const hotspots = document.querySelectorAll('.hotspot');
  const panels = document.querySelectorAll('.panel');
  const closeButtons = document.querySelectorAll('[data-close]');

  function openPanel(panelId) {
    if (!overlay) return;
    
    panels.forEach(panel => {
      panel.classList.remove('is-active');
      panel.style.display = 'none';
    });

    const targetPanel = document.querySelector(`.panel[data-panel="${panelId}"]`);
    if (targetPanel) {
      overlay.classList.add('is-open');
      overlay.style.display = 'flex';
      overlay.setAttribute('aria-hidden', 'false');
      
      targetPanel.style.display = 'block';
      setTimeout(() => {
        targetPanel.classList.add('is-active');
      }, 10);
    }
  }

  function closeAllPanels() {
    if (!overlay) return;
    
    if (typeof binderInner !== 'undefined' && binderInner) {
      binderInner.classList.remove('is-open');
    }

    panels.forEach(panel => {
      panel.classList.remove('is-active');
      panel.style.display = 'none';
    });
    
    overlay.classList.remove('is-open');
    overlay.style.display = 'none';
    overlay.setAttribute('aria-hidden', 'true');
  }

  hotspots.forEach(hotspot => {
    hotspot.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = hotspot.getAttribute('data-id');
      openPanel(id);
    });
  });

  closeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAllPanels();
    });
  });

  if (overlayBackdrop) {
    overlayBackdrop.addEventListener('click', closeAllPanels);
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllPanels();
  });

  // 4. macOS Finder & Folder Interactive System (20 PAGES PER FOLDER)
  const macFolders = document.querySelectorAll('.mac-folder');
  const finderWindow = document.getElementById('finderWindow');
  const finderClose = document.getElementById('finderClose');
  const finderTitle = document.getElementById('finderTitle');
  const finderGrid = document.getElementById('finderGrid');
  const finderPrev = document.getElementById('finderPrev');
  const finderNext = document.getElementById('finderNext');
  const finderCounter = document.getElementById('finderCounter');

  let activeFolderKey = 'projects';
  let activeCardIndex = 0;

  const folderData = {
    projects: {
      title: "01_Foundation Work",
      cards: [
        { tag: "V & R (Foundation)", title: "Line, Texture & Rhythm Study", desc: "The sketch is a set of line experiments exploring movement, texture, and rhythm. The repeated strokes, waves, zigzags, and hatch marks to test how simple lines can create different visual effects. Some rows feel smooth and flowing, while others feel rough, dense, or noisy. The variation in spacing, thickness, and direction shows the a single visual can have variations.", image: "Line work of VnR Foundation.png", year: "2024" },
        { tag: "V & R (Foundation)", title: "Observational Ink & Texture Study", desc: "A detailed monochrome sketch depicting a piece of gnarled driftwood or a fallen, weathered tree branch resting horizontally on the ground. Rendered using fine ink and kitta line work, cross-hatching, and stippling to depict realistic bark textures, rough wood grain, and broken branch nodes. Soft ground shading beneath the log to establish shadows, creating a sense of three-dimensional depth and spatial placement. Serves as a organic visual element which justifies the beauty of nature on paper too", image: "tree branch sketch with inck.png", year: "2024",},
        { tag: "V & R (Foundation)", title: "Layered Strata & Sun", desc: "A stylized, abstract landscape sketch featuring rolling hills or terrain layers under a partially setting or rising sun in the upper-left corner. Combines line art with intricate pattern shading, giving each topographical layer a distinct texture (such as fine vertical hatching, stippling, pebble-like patterns, and bold dark fills). Dominated by monochrome black and white textures, contrasted with a vibrant pop of orange color reserved for the sun. Uses overlapping horizontal bands of varied patterns to create depth, evoking natural earth strata, fields, or stylized mountain ranges.", image: "Line work Sketch VnR.png", year: "2024", },
        { tag: "V & R (Foundation)", title: "Ochre & Ink: Object Study", desc: "A still-life sketch depicting an everyday reusable water bottle placed vertically on a flat surface. Rendered with detailed dark pencil or ink cross-hatching and shading to convey light reflections, form highlights, and a soft contact shadow at the base. Placed inside a portrait frame featuring a solid, warm ochre/gold backdrop, which provides a high-contrast pop against the dark linework. Features a clean, observational study style that blends traditional hand-drawn line art with a modern, block-color layout.", image: "Inck Bottle Sketches.png", year: "2024"},
        { tag: "V & R (Foundation)", title: "LOTUS SEEDS", desc: "A botanical mood board exploring the anatomy and lifecycle of the lotus seed. This mixed-media study blends detailed hand-drawn illustrations—depicting dry pods, sprouts, and structural cross-sections—with vivid photo prints of aquatic habitats. Mounted on a neutral canvas with handwritten placards, the presentation bridges precise scientific documentation with raw, tactile design techniques.", image: "lotus Poster VNR.png", year: "2024"},
        { tag: "V & R (Foundation)", title: "Volumetric Line & Form Series", desc: "A collection of six distinct minimalist line sketches arranged in a 2x3 grid, exploring abstract organic forms and geometric compositions. Several cards feature fluid, topographic, or ribbon-like contour lines that mimic natural waves, wireframe meshes, and layered depth patterns. Other cards focus on clean, balanced geometric arrangements using overlapping circles, arcs, semi-circles, and straight intersecting lines. Drawn with precise monochrome line art on soft muted backgrounds, emphasizing volumetric form, spatial relationships, and abstract minimalism.", image: "Line Sketches of VNR.png", year: "2024"},
        { tag: "V & R (Foundation)", title: "Material & Form Studies", desc: "This collection explores spatial depth, structure, and organic forms through diverse physical media. The series features a fluid wire and thread mesh web, an interlocking cardstock geometric module, and a framed diagonal string lattice. Complementing these are staggered translucent acetate planes designed to manipulate light and shadow, alongside a carved foam block with organic, seed-pod-like relief hollows.", image: "Model VnR.png", year: "2024"},
        { tag: "V & R (Foundation)", title: "Tactile Surface & Tension Study", desc: "A physical architectural or structural prototype model exploring dynamic geometry, curvature, and tensioned spatial lines. Features a curved, hyperbolic-paraboloid-like main body (or cradle) connected across its inner span by a series of crisscrossing tension lines. Represents a tactile exploration of vector paths, surface curvature, and spatial motion—fitting for the accompanying Gesture Library interaction research context. Thin flexible sheet metal (such as aluminum) or matte metallic sheet Fine copper wire stringing threaded through perforated holes along the curved edges.", image: "Lamp Protopype vnr.png", year: "2024"},
        { tag: "V & R (Foundation)", title: "Orbiseed", desc: "Visual Description: Illustrates multi-view technical and orthographic concept sketches on dark slate paper, labeled with the title Orbiseed. It shows a rigid vertical support post fixed to a rectangular base, holding a curved, shell-like sail or pod element. Intended Materials: Depicts a warm wooden base/support structure paired with a lightweight, translucent, or flexible curved canopy element. Design Purpose: Acts as the initial structural blue-print, exploring attachment points, proportions, and how a curved, organic form mounts onto a stable central spine.", image: "Lamp Poster.png", year: "2024"},
        { tag: "V & R (Foundation)", title: "Orbiseed", desc: "Visual Description: Shows the fully realized 3D physical sculpture. It features a sweeping, conical metallic shell mounted onto a wooden base plate, with fine internal stringing spanning the inner curve. Shell: Flexible sheet metal (such as aluminum or tin) accented with decorative surface cutouts/perforations. Tension Lines: Fine copper or brass wire strung along the interior rim to form a web-like grid. Outcome Realization: Translates the static structural concept into a tangible form, using real-world material tension and light-reflecting metal to bring the sketched curvature to life. ", image: "Final Lamp Vnr.png", year: "2024"},
        { tag: "Tecnical Drawing (Foundation)", title: "Orthographic Projections & Isometric Draft", desc: "The draft includes standard 2D projections detailing the geometry—specifically a *Front Elevation, a **Side Elevation, and a **Plan (Top) View*. Located on the bottom-right of the sheet, an isometric  view presents a 3D visual representation of the final object. The object features a tall, rectangular solid base with a stepped, central cylindrical peg or shaft extending from its top surface. Placed on a grid layout, the drawing includes dimension lines, boundary outlines, and a bottom title block for drafting  measurements.", image: "TD 1.png", year: "2024"},
        { tag: "Tecnical Drawing (Foundation)", title: "Truncated Solids & Sectional Studies", desc: "A technical drafting study demonstrating radial line development to unfold 3D conical surfaces into 2D flat templates. Arranged in a 2x4 matrix, the sheet systematically explores diverse cut angles and base geometries—utilizing cross-hatched section planes, precise projection lines, and a standard framed title block to plot true shapes and views.", image: "TD 2.png", year: "2024"},
        { tag: "Tecnical Drawing (Foundation)", title: "Asymmetric Orthographic Projections", desc: "An orthographic projection study mapping an asymmetrical assembly of 3D geometric forms—including a cone, sphere, and rectangular blocks. Featuring Front, Side, and Plan views, the layout utilizes precise projection lines for spatial alignment and subtle gradient shading to convey depth and surface curvature within a standard framed title block.", image: "TD 3.png", year: "2024"},
        { tag: "Tecnical Drawing (Foundation)", title: "Conical Surface Unfolding & True Shape Projections", desc: "A technical study demonstrating radial line development to project a truncated conical surface onto a 2D template. Using generator lines radiating from the apex and arc divisions, the layout maps the cut cone’s elliptical profile seamlessly across plan, elevation, and unrolled views within a standard gridded, framed title block.", image: "TD 4.png", year: "2024"},
        { tag: "Tecnical Drawing (Foundation)", title: "Orthographic Views & Isometric Housing Draft", desc: "Displays standard 2D views—including Front Elevation, Side Elevation, and Plan (Top) View—to map out the precise dimensions and alignment of the object. Features a pictorial isometric view in the lower-right region to illustrate the overall three-dimensional form and volume. Depicts a low-profile, elongated base with a raised, curved central hood/housing assembly. Formatted on a standard grid sheet with dimensional extension lines, boundary frames, and a bottom title block for technical specs.", image: "TD 5.png", year: "2024"},
        { tag: "Tecnical Drawing (Foundation)", title: "Conical Surface Intersections & Orthographic Views", desc: "Explores the geometric intersection between a 3D conical shape and an intersecting sphere or circular body. Features orthographic elevations and a plan (top) view detailing the alignment and spatial relationships from multiple angles. Uses construction and generator lines radiating from the apex to plot the precise curved profile where the two geometries meet. Incorporates filled/shaded circular regions to emphasize the intersecting sphere and clarify spatial depth. Formatted on a grid sheet enclosed within a formal border and a bottom title block for drafting parameters.", image: "TD 6.png", year: "2024"},
      ]
    },
    experiments: {
      title: "02_Interaction Work",
      cards: [
        { tag: "Embodement", title: "Star Fruit Botanical Illustration", desc: "Presents multiple digital illustrations of star fruit (carambola) in various orientations and states—including whole fruits, cross-sectional slices showing the characteristic star shape, and partially cut pieces. Uses soft yellow-green gradients with delicate highlights and shadow contours to convey volume, surface texture, and natural translucency. Arranged on a muted sage-green rectangular background panel that provides high-contrast isolation for the warm yellow subjects.", image: "Star Fruit Ixd.jpg", year: "2025"},
        { tag: "Embodement", title: "Day 3: Implementation Prototype", desc: "A design and assembly study for a vertical hanging structure inspired by star fruit cross-sections. Built using laser-cut 5mm MDF, the piece links varying star modules (2.5 to 4 inches) from a 5.5-inch circular top disc using acrylic wire. The documentation includes explicit dimensional specs and a step-by-step schematic showing the central suspension loop and hardware path.", image: "Star Fruit Lamp prototype Ixd.jpg", year: "2025"},
        { tag: "Embodement", title: "Star Fruit Final MDF Lamp prototype", desc: "Design and assembly specifications for a vertical hanging structure inspired by star fruit cross-sections. Built from laser-cut 5mm MDF, the modular piece links star shapes (ranging from 2.5 to 4 to a 5.5) circular top disc using acrylic wire. The sheet includes dimensional specs and a step-by-step schematic of the suspension wire loop.", image: "Final Lamp IXD.png", year: "2025",},
        { tag: "Embodement", title: "Day 4: Twist with Wire – Wired Prototype", desc: "An interactive light sculpture featuring a vertical star-fruit profile built from a 1mm wire frame. The process documents wrapping the metallic wire with thread, custom-dyeing it green to mirror the star fruit aesthetic, and embedding fairy lights—showing both the intricate woven texture up close and the glowing final illuminated piece suspended from a top loop.", image: "Star Fruit wire lamp Ixd.jpg", year: "2025"},
        { tag: "Embodement", title: "Day 5: Let’s Dye It! – Thread & Color Transformation", desc: "An interactive light sculpture built from a 1mm wire star-fruit frame wrapped in thread, custom green-dyed, and integrated with internal fairy lights. The process documents the material transformation from raw wire to a suspended, glowing geometric form—showing both unlit woven textures and illuminated views.", image: "Star Fruit wire Lamp prototypes process Ixd.jpg", year: "2025"},
        { tag: "Embodement", title: "Materials & Process: Wire-Wrapped Star Fruit Sculpture", desc: "Early structural prototyping for the star-fruit sculpture, documenting the transition from raw wire to a wrapped armature. It features initial tests (First attempt and Wired prototype) for forming the central axis and star-shaped ridges, alongside detailed callouts showing the manual process of wrapping cotton thread around the wire to build volume and surface texture.", image: "Final wire lamp ixd.png", year: "2025"},
        { tag: "Auditory UI", title: "Emotional States Character Set", desc: "Anger: Represented by a sharp, jagged red character with aggressive facial features and energetic outline vectors. Loneliness: Depicted as a slumping figure curled up under dark, drooping tendrils or shadows. Confusion: Visualized by a green character with spiral eyes and swirling loops around its head indicating disorientation. Isolation: Features a figure standing alone facing a shadowed reflection in a mirror frame. Thirst: Visualized by a slouched, extended character walking with bent posture. Happiness: Depicted as a round, rosy pink character with a content smile and hand raised in a gentle wave.", image: "emotions 1 image IXD.png", year: "2025"},
        { tag: "Spatial Experiment", title: "Emotional States Character Set", desc: "Hunger: Represented on a vibrant red tile by a single, stylized black fork running vertically through the center. Empathy: Depicted on a brown background using abstract geometric shapes and overlapping profile contours, symbolizing connection or shared perspective. Calmness: Visualized on a soft pink tile by a relaxed, cloud-like character with closed eyes, wearing a headband or wrap to express tranquility and peace.", image: "emotions 2 image IXD.png", year: "2025"},
        { tag: "Experimental UI", title: "Illuminated Monogram Signage Design", desc: "Brand Identity Mockup (Café Noir): Applies the golden illuminated monogram onto a textured dark card layout above the brand name (Café Noir EST 2024), illustrating how the emblem functions in a premium physical or digital print application.", image: "AP cafe mock up IXD.png", year: "2025"},
        { tag: "Motion Design", title: "Monogram Scale & Hierarchy Study", desc: "Scale & Hierarchy Variations: Demonstrates typography scaling across a dark burgundy banner, showing how the monogram maintains legibility and visual balance across different size increments.", image: "AP in different size ixd.png", year: "2025"},
        { tag: "Gesture IxD", title: "Brand Palette Exploration: Monogram Variations", desc: "Interlocking Monogram Design: The core logo mark combines the letters (A) and (P) into a single continuous serif dynamic monogram, featuring decorative ball terminals and fluid curves.Brand Colorway Matrix: Features color variations presented in dark navy blue, warm cream, and deep chocolate brown tiles to test contrast and adaptability across light and dark backgrounds.", image: "Ap in different colour IXD.png", year: "2025"},
        { tag: "Cursor Metaphor", title: "Costa Coffee Brand Identity & Logo Variations", desc: "Logo Mark Design: Features a coffee cup graphic with rising steam vectors integrated with stylized typography reading (Costa Coffee). Layout & Compositional Variations: Displays multiple arrangements of the logo mark and logotype—including a centered stacked version, a simplified mark with single-line text, and a lockup with secondary subtext (coffee). Color Palette: Uses a warm gradient background transitioning from creamy white to deep red-orange, reinforcing a cozy, coffee-inspired color story.", image: "Costa logo IXD.png", year: "2025"},
        { tag: "Sound System", title: "Costa Coffee Exhibition Stand Application", desc: "Exhibition Stand / Retail Application: Shows the rebrand applied in a physical coffee shop or trade show booth setting, featuring illuminated back-lit wall panels and a large overhead header reading (The Art of Coffee). Brand Collateral: Demonstrates print application on branded materials, including a thick presentation book or menu binder on the counter featuring the main logo lockup. Digital Display Integration: Displays dynamic digital screens integrated into the booth structure to showcase food/beverage offerings and interactive media within the environment.", image: "Costa layout Ixd.png", year: "2025"},
        { tag: "Haptic Feedback", title: "Narrative Arc Zine Grid: Blue to Warmth", desc: "Formatted as a 4x4 grid on a blue gradient banner, this project explores a visual and narrative shift from isolation to warmth. Heavy blue-tinted imagery and poetic text overlays (e.g., Silence has a tint) evoke containment, which gradually breaks into vibrant yellow dandelions and colorful ink bursts to symbolize emotional release and openness.", image: "Zine New Design IXD.jpeg", year: "2026"},
        { tag: "Scroll Motion", title: "Duotone Poster Triptych: COLOUR", desc: "Triptych Palette Variations: Presents three side-by-side variations of the same poster using high-contrast, duotone colorways. Typographic Depth: Displays distorted (COLOUR) typography layered behind the central subject to create background depth. Left: Yellow typography with warm red and gold ambient lighting. Center: Red typography paired with deep blue and magenta tones. Right: Blue-to-purple gradient typography set against a yellow-green ground. Subject Masking: Isolates a subject in traditional attire, allowing background text and color overlays to pop around the cutout figure.", image: "Colour different in my image IXD.png", year: "2026"},
        { tag: "Prototyping", title: "UniPark: Smart Parking Management Console", desc: "UniPark is a real-time parking management dashboard for campus operators. It pairs live ANPR camera feeds and driver profiles with a color-coded slot occupancy map across facility zones. Featuring quick action toggles for automated or manual overrides, high-level capacity metrics, and vertical sidebar navigation, the console streamlines spatial monitoring and security logging. Link:- https://uni-park-smart-console.vercel.app/", image: "Smart Parking Ixd.png", year: "2026"},
        { tag: "Interaction Showcase", title: "Interaction Lab Sandbox", desc: "Playground combining all 19 micro-interaction experiments in one place.", image: "Care connect flow chart IXD.png", year: "2026"}
      ]
    },
    casestudies: {
      title: "03_Graphic Design-Minor",
      cards: [
        { tag: "Typography (Minor)", title: "Found Alphabet: Environmental Letterform Study", desc: "Collects photographic cutouts of everyday architectural and ambient objects found in immediate surroundings that naturally resemble letterforms (e.g., ladders for A, pipes for U, scaffolding for X). Demonstrates sensitivity to negative space, form, and structural geometry by discovering tactile, physical typography in everyday built environments. Features a variety of real-world materials—including wood, metal, architectural frameworks, and shadows—to explore contrast, texture, and visual rhythm.", image: "Font identification in campus minor.png", year: "2025"},
        { tag: "Typography (Minor)", title: "Geometric Type Exploration: GAMER", desc: "Features hand-drawn letterforms spelling out (GAMER) rendered on grid paper to ensure precise alignment, proportion, and structural consistency. Employs sharp, geometric angles, segmented cutouts, and blocky proportions inspired by digital and arcade typography styles. Focuses on designing a custom, high-impact display lettering concept suitable for branding, editorial covers, or gaming graphics. Uses clean pencil outlines to map out letter proportions and spatial rhythm before digital vector tracing and refinement.", image: "Font Making sketch Minor.png", year: "2025"},
        { tag: "Poster Series", title: "John Wick Vector Poster", desc: "A vector portrait poster of John Wick created in Adobe Illustrator using high-contrast shadows and clean cell-shading. Set against a muted red and black cityscape, the composition utilizes a structured grid layout with stacked background typography (JOHN WICK) and a three-column bottom alignment (No Rules | No Mercy | Just Wick) to build strong visual hierarchy.", image: "John Wick poster Minor.png", year: "2025"},
        { tag: "Poster Series", title: "JDM Street Culture Poster: Nissan Skyline GT-R R34", desc: "A JDM street-culture poster combining a stylized Nissan Skyline GT-R R34 cutout with a vibrant Japanese residential backdrop. Using advanced Photoshop masking and blending, typography (SKYLINE, Nissan, GT-R, R34) is woven at varying depths—behind power lines and utility poles—establishing a bold hierarchy through warped orange lettering and light-blue serif text.", image: "Nissan Poster Minor.png", year: "2025"},
        { tag: "Publication", title: "Two-Tone Streetwear Graphic T-Shirt Mockup", desc: "Features front and back digital vector flat-lay mockups of a two-tone t-shirt (dark gray torso with black sleeves) designed in Adobe Illustrator. Displays a rectangular frame on the back featuring vertically stacked, distorted/liquified typography set against a diagonal red slash background. Explicit Content badge in the bottom left corner of the front view to evoke a streetwear or tour merchandise look. Keeps the front torso clean and minimal to maintain a strong visual contrast with the bold graphic back panel.", image: "Tshirt design Minor.png", year: "2025"},
        { tag: "Packaging Design", title: "Letterform Study: 12 Variations of (P)", desc: "A systematic typographic study mapping 12 hand-drawn variations of the letter (P) on a graph paper grid. Ranging from sharp Blackletter forms to organic serifs and heavy display weights, the sketches use pencil shading and inverted negative space blocks to test stem thickness, bowl curvature, and visual legibility.", image: "different types of P Minor.jpg", year: "2026"},
        { tag: "Information Design", title: "Grid-Based (PG) Logotype Exploration", desc: "A systematic exploration of the letter (P) mapped across 12 hand-drawn variations on graph paper. Using the grid, the sketches iterate through diverse styles—from sharp Blackletter and Gothic forms to organic serifs and heavy display weights—testing stem thickness, bowl curvature, and negative space contrast through pencil shading.", image: "Pg logo prototypes different sample Minor.png", year: "2026"},
        { tag: "Type Exploration", title: "Logo Hierarchy & Weight Testing", desc: "Monogram & Scale Variations: Explores the interlocking PG monogram alongside the wordmark (Pushti Gandhi) across multiple typographic weights and optical sizes. Contrast & Modes: Tests black-on-white (light mode) and white-on-black (dark mode) applications to evaluate letterform legibility and spatial balance across opposing backgrounds.", image: "Pg size different Minor.jpg", year: "2026"},
        { tag: "Brand Strategy", title: "Core Identity Mark", desc: "Color Palette & Contrast: Sets the cream PG monogram and serif wordmark against a rich, dark burgundy background. Visual Alignment: Establishes the primary brand lockup, anchoring the serif monogram directly alongside the designer's full name.", image: "Pg visting card front Minor.png", year: "2026"},
        { tag: "Art Direction", title: "Business Card Application", desc: "Layout & Contact Grid: Features a double-sided/horizontal business card design incorporating the monogram mark, contact details, and social handles. Minimal Separation: Uses a clean, angled divider line to separate identity branding on the left from structured contact information on the right.", image: "Pg visting card back Minor.png", year: "2026"},
        { tag: "Visual System", title: "Letterhead Stationery Layout", desc: "Brand Architecture: Demonstrates the print stationery system with a primary logo header, a date line, and a footer bar containing contact details. Watermark Integration: Incorporates a large, low-opacity PG watermark centered across the main body area to add subtle texture while preserving readability.", image: "Pg Letter head Minor.png", year: "2026"},
        { tag: "Editorial", title: "Coffee Packaging & Merchandise Mockup", desc: "3D Brand Application: Translates the vector identity onto physical assets, including takeaway coffee cups, sleeves, and paper packets. Material & Color System: Applies warm beige, rich brown, and white tones to showcase how the PG emblem scales across curved surfaces and tactile packaging materials.", image: "Pg mockup of coffee mug Minor.png", year: "2026"},
        { tag: "Packaging", title: "Primary Club Logo Mark Lockup", desc: "Symbolic Concept: Combines a dancer silhouette formed within the letter (D) with a surrounding orbital ring and accent stars, visually reinforcing the brand theme of a dance universe.", image: "Dance club logo minor.png", year: "2026"},
        { tag: "Identity Design", title: "Apparel Mockup Application", desc: "Center-Chest Placement: Demonstrates the vector mark applied as a large chest graphic on a light gray pullover hoodie. Graphic Scalability: Features the isolated icon without the text lockup, highlighting how the core logo mark functions independently as standalone apparel merchandise.", image: "Dance club mock up minor.png", year: "2026"},
        { tag: "Booklet", title: "Gujarat Street Art", desc: "Visuals: Shows a bright yellow building exterior adorned with a vibrant, colorful mural depicting stylized animals (including an elephant). Design Features: Sets up the visual identity using bold red and black graphic blocks alongside modern Gujarati script accents.", image: "Gujarat street booklet front.png", year: "2026"},
        { tag: "Booklet", title: "Rural Wall Art, Kutch.", desc: "Visuals: Highlights Lippan Kaam, showing traditional mud-and-mirror wall art on round mud huts (Bhungas) along with thatched roofs and textured clay structures. Layout & Content: Features a repeating vertical typographic banner reading (STREET ART) on the far left. The spread integrates warm, earthy photography with structured narrative text explaining the 300-year-old craft practiced by the Mutwa and Rabari communities.", image: "Gujarat street booklet page 1.png", year: "2025"},
        { tag: "Booklet", title: "Old City (Pols) Ahmedabad.", desc: "Visuals: Features a multi-story urban wall mural displaying traditional Gujarati motifs, Garba dancers, and folk patterns. Layout & Content: Employs a vertical high-contrast black band with bold serif typography on the left page. The right page includes descriptive editorial text detailing the heritage zones of Old Ahmedabad (e.g., Manek Chowk, Khadia) and red accent callout blocks in Gujarati script.", image: "Gujarat street booklet page 2.png", year: "2024"},
        { tag: "Booklet", title: "Kamati Baug, Vadodara.", desc: "Visuals: Displays a large, full-facade building mural highlighting Vadodara's landmarks, including the Kamati Baug amphitheater, Sursagar Lake, and the equestrian statue of Maharaja Sayajirao Gaekwad. Layout & Content: Combines large-scale display typography (Kamati Baug Vadodara) across a light-and-dark split backdrop, paired with structured body text and a highlighted red bilingual quote box at the bottom.", image: "Gujarat street booklet page 3.png", year: "2026"},
        { tag: "Brand Strategy", title: "Inside Tri-Fold Spread (Typography & History)", desc: "Multi-Column Editorial Layout: Organizes content into a three-panel fold, featuring historical background on type designer William Caslon alongside details on the Old English Text MT font family. Layered Graphic Elements: Combines portrait imagery, architectural background graphics, vertical typography margins (William Caslon and APPLICATION), and large numeral overlays to structure the narrative flow.", image: "3 face Folding Minor.png", year: "2026"},
        { tag: "Retrospective", title: "Tri-Fold Cover & Back Panels", desc: "Cover & Structural Panels: Layout showing the outer panels, including vertical display headers (Text History and Old English) paired with a detailed architectural sketch of the Roman Colosseum. High-Contrast Editorial Grid: Uses a solid black center panel contrasted against parchment-textured outer panels to create visual separation between the front cover, back cover, and inside flap.", image: "3 face Folding Minor back.png", year: "2026"}
      ]
    },
    macboard: {
      title: "04_Gig Work",
      cards: [
        { tag: "Vehicool", title: "VehiCool Monogram Suite", desc: "The VehiCool monogram suite features six logo variations built around an integrated (V) and (C) identity, using cool teals and blues to symbolize fresh air and temperature control. The top concepts use fluid gradients to show dynamic airflow, the middle row applies crisp geometric lines for an engineered aesthetic, and the bottom designs blend classic serif typography with a dual-strand wave to represent cool air currents.", image: "Vehicool Logo prototype 1.png", year: "2026"},
        { tag: "Vehicool", title: "Concept Iterations", desc: "The concept iterations evolve from explicit typography to a clean, minimalist silhouette. The initial options stretch the letter (C) into a car outline to spell out (ool), while the middle design adds dynamic side wave lines to represent cooling airflow.The final concept strips away all extra lettering and line work, leaving a continuous-line vehicle silhouette seamlessly integrated into the (VC) monogram.", image: "Vehicool Logo prototype 2.png", year: "2025"},
        { tag: "Vehicool", title: "Clean & Minimalist Identity", desc: "Seamless Monogram-to-Silhouette Flow: The finalized design refines the bottom concept, smoothly transitioning the initial (V) and (C) letters directly into a single, elegant vehicle silhouette. Refined Line Work: All extra typographic elements (ool) and internal wave graphics are eliminated to achieve an ultra-clean, modern, and uncluttered aesthetic. Cohesive Gradient Strategy: Retains a subtle blue-to-teal gradient along the continuous line, reinforcing the themes of cooling, fresh airflow, and modern automotive technology.", image: "Vehicool final Logo.png", year: "2026"},
        { tag: "Finival", title: "Onboarding / Introduction", desc: "This AI-powered personal finance companion simplifies money management by helping users assess investment capacity, evaluate risk, receive tailored advice, and track portfolios in one place. The Onboarding screen builds trust through a clean, step-by-step card sequence with simple icons and a preview of the AI advisor. Featuring an early investment capacity prompt, progress bar, skip option, and prominent (Get Started) button, the flow creates a seamless entry into personalized financial management.", image: "Finival App UI 1.png", year: "2026"},
        { tag: "Finival", title: "Login & Account Creation", desc: "The Authentication and Sign-In screen offers a fast, secure entry point for new and returning users. Featuring a simple toggle to switch between log-in and account creation, users can register via email/phone or opt for instant Google and Apple social sign-ins. The layout incorporates essential controls—a password visibility toggle, a (Forgot Password) link, and an initial risk-tolerance selector—to secure access and immediately start personalizing investment recommendations.", image: "Finival App UI 2.png", year: "2026"},
        { tag: "Finival", title: "Main Financial Dashboard", desc: "The Main Financial Dashboard acts as the app's central control panel, delivering a clear summary of overall financial health through a card-based layout. It displays monthly investment capacity alongside detailed breakdowns of income, expenses, and available funds. To drive proactive decision-making, the screen features a Market Pulse section tracking indicators like Sensex, Nifty 50, and Gold, paired with real-time AI financial tips. Persistent bottom navigation ensures effortless switching between Home, Analyze, AI Advisor, Portfolio, and Profile.", image: "Finival UI 8.png", year: "2026"},
        { tag: "Finival", title: "AI Recommendations / Financial Alerts", desc: "The AI Recommendations feed transforms complex financial data into a scannable stream of actionable insights tailored to the user's risk profile, income, and spending patterns. Using a familiar notification-card layout, it delivers updates—such as SIP suggestions, emergency fund alerts, and market news—complete with clear rationale and timestamps (2 mins ago) so users can instantly evaluate next steps.", image: "Finival UI 9.png", year: "2026"},
        { tag: "Finival", title: "Investment Analysis / Financial Calculator", desc: "The Investment Analysis screen helps users calculate their realistic monthly investment capacity through intuitive, interactive controls rather than complex forms. By adjusting income and expense sliders, users immediately see their net investable amount alongside long-term growth projections based on their selected risk profile—Conservative, Moderate, or Aggressive. The layout makes financial modeling approachable for beginners, giving them clear expected-return insights before they commit capital.", image: "Finival UI 10.png", year: "2026"},
        { tag: "Finival", title: "Recommended Investment Allocation", desc: "The Recommended Investment Allocation screen translates a user's risk profile and financial capacity into a visual asset distribution model. A central, color-coded donut chart pairs exact rupee amounts with percentages to break down suggested investments across Emergency Funds, Index Funds, Debt, Gold ETFs, and International Assets. By combining visual charts with exact figures, the interface simplifies portfolio strategy at a glance, anchored by a prominent call-to-action for personalized AI advice to guide final execution.", image: "Finival UI 11.png", year: "2026"},
        { tag: "Finival", title: "AI Financial Advisor", desc: "The AI Financial Advisor screen provides a chat-based interface for asking personal finance questions in natural language. Leveraging contextual analysis of the user's profile, the assistant delivers personalized guidance while demystifying complex market jargon. Designed like a modern messaging app, the interface features interactive suggestion chips—such as (Where to invest ₹10,000?)—to jumpstart conversations effortlessly. Structured AI response cards, timestamps, and persistent bottom navigation make receiving tailored advice continuous, clear, and conversational.", image: "Finival UI 12.png", year: "2026"},
        { tag: "Finival", title: "AI Portfolio Insights", desc: "The AI Portfolio Insights screen translates standard investment metrics into clear, actionable intelligence by analyzing individual holdings and overall portfolio balance. Designed with color-coded cards and intuitive status indicators, the layout highlights key performance trends, diversification levels, concentration warnings, and targeted SIP opportunities at a glance. Instead of overwhelming users with raw numbers, short explanatory insights clarify the rationale behind each callout, while a prominent (Full AI Analysis) call-to-action allows for deeper exploration when needed.", image: "Finival UI 13.png", year: "2025"},
        { tag: "Finival", title: "Connected Portfolio Overview", desc: "The Connected Portfolio Overview screen provides a centralized snapshot of all linked investment accounts for quick, effortless tracking. A top summary card highlights core financial metrics—total invested amount, current portfolio value, and overall return percentage. Directly below the balance, integrated AI Portfolio Insights explain key performance drivers, supported by a dedicated (Full AI Analysis) button for deeper evaluations. Highlighted portfolio navigation ensures intuitive movement across the platform.", image: "Finival UI 14.png", year: "2026"},
        { tag: "Finival", title: "Multi-Platform Portfolio Tracking", desc: "The Multi-Platform Portfolio Tracking screen unifies holdings from various investment accounts into a single interface, eliminating app switching. Dedicated portfolio cards categorize assets—like stocks and mutual funds—by platform, including services like Zerodha and Groww. Each card displays individual holdings, current market values, and color-coded percentage gains or losses. This organized dashboard reduces interface fragmentation, providing a clear, single-source view of overall investment performance.", image: "Finival UI 15.png", year: "2026"},
        { tag: "Finival", title: "Connected Platforms / Portfolio Integration", desc: "The Portfolio Connection Management screen lets users integrate external platforms like Zerodha and Groww beneath a consolidated summary card. Supported brokerages are listed with logos, names, and explicit (Connected) or (Connect) status buttons. To build trust, prominent security messaging highlights read-only access—reassuring users the app tracks performance without executing trades. Intuitive controls and persistent bottom navigation keep multi-platform management simple, transparent, and secure.", image: "Finival UI 16.png", year: "2026"},
        { tag: "Finival", title: "Profile / Investment Goals & Risk Profile", desc: "The Personal Financial Profile screen lets users set investment goals and risk preferences through interactive controls instead of tedious questionnaires. Selectable goal chips—such as Retirement, Emergency Fund, and Wealth Creation—allow users to quickly specify their financial priorities. To tailor AI recommendations, an intuitive risk-profile selector offers Conservative, Moderate, and Aggressive tiers linked to expected annual return ranges. Supported by a clear profile summary and highlighted bottom navigation, the screen gives users full control over their tailored strategy.", image: "Finival UI 17.png", year: "2026"},
        { tag: "Finival", title: "Settings / Notifications / Privacy", desc: "The Profile Settings and Preferences screen gives users total control over notifications, security, and data privacy through a clean, intuitive settings hierarchy. Interactive toggles make it easy to enable or disable AI Recommendations and Market Alerts on demand. The layout also provides rapid access to Privacy & Security settings, Terms of Service, Help & Support, and a standard Sign Out option. Finished with a clear financial disclaimer, the design reinforces transparency, data safety, and user trust. Link :- https://aloe-rug-80400164.figma.site", image: "Finival UI 18.png", year: "2026"},
      ]
    }
  };

  function renderFinderPage() {
    const data = folderData[activeFolderKey] || folderData.projects;
    const card = data.cards[activeCardIndex];
    if (!card) return;

    if (finderTitle) finderTitle.textContent = data.title;
    if (finderCounter) finderCounter.textContent = `${activeCardIndex + 1} / ${data.cards.length}`;

    if (finderGrid) {
      finderGrid.innerHTML = `
        <article class="work-card">
          <div class="work-card__image-container">
            <img class="work-card__image" src="${card.image}" alt="${card.title}" />
          </div>
          <div class="work-card__content">
            <div class="work-card__meta">
              <span class="work-card__tag">${card.tag}</span>
              <span class="work-card__year">${card.year}</span>
            </div>
            <h3>${card.title}</h3>
            <p>${card.desc}</p>
            <div class="work-card__footer">
              <span class="work-card__role">${card.role}</span>
              <ul class="work-card__highlights">
                ${card.highlights ? card.highlights.map(h => `<li>${h}</li>`).join('') : ''}
              </ul>
            </div>
          </div>
        </article>
      `;
    }
  }

  macFolders.forEach(folderBtn => {
    folderBtn.addEventListener('click', () => {
      activeFolderKey = folderBtn.getAttribute('data-folder') || 'projects';
      activeCardIndex = 0;
      renderFinderPage();
      if (finderWindow) finderWindow.classList.add('is-open');
    });
  });

  if (finderPrev) {
    finderPrev.addEventListener('click', () => {
      const data = folderData[activeFolderKey] || folderData.projects;
      activeCardIndex = (activeCardIndex - 1 + data.cards.length) % data.cards.length;
      renderFinderPage();
    });
  }

  if (finderNext) {
    finderNext.addEventListener('click', () => {
      const data = folderData[activeFolderKey] || folderData.projects;
      activeCardIndex = (activeCardIndex + 1) % data.cards.length;
      renderFinderPage();
    });
  }

  if (finderClose && finderWindow) {
    finderClose.addEventListener('click', () => {
      finderWindow.classList.remove('is-open');
    });
  }

  // 5. Dossier Binder Flip Navigation
  const binderInner = document.getElementById('binderInner');
  const binderOpenTrigger = document.getElementById('binderOpenTrigger');
  const binderBack = document.getElementById('binderBack');
  const resumePages = document.querySelectorAll('.resume-page');
  const resumeDots = document.querySelectorAll('.resume-dots i');
  const resumeNext = document.getElementById('resumeNext');
  const resumePrev = document.getElementById('resumePrev');
  let currentResumePage = 0;

  if (binderOpenTrigger && binderInner) {
    binderOpenTrigger.addEventListener('click', () => {
      binderInner.classList.add('is-open');
    });
  }
  if (binderBack && binderInner) {
    binderBack.addEventListener('click', () => {
      binderInner.classList.remove('is-open');
    });
  }

  function showResumePage(index) {
    resumePages.forEach((pg, idx) => {
      pg.classList.toggle('is-active', idx === index);
    });
    resumeDots.forEach((dot, idx) => {
      dot.classList.toggle('is-active', idx === index);
    });
    currentResumePage = index;
  }

  resumeDots.forEach((dot) => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      const pageIdx = parseInt(dot.getAttribute('data-dot'), 10);
      showResumePage(pageIdx);
    });
  });

  if (resumeNext) {
    resumeNext.addEventListener('click', (e) => {
      e.stopPropagation();
      const nextPage = (currentResumePage + 1) % resumePages.length;
      showResumePage(nextPage);
    });
  }

  if (resumePrev) {
    resumePrev.addEventListener('click', (e) => {
      e.stopPropagation();
      const prevPage = (currentResumePage - 1 + resumePages.length) % resumePages.length;
      showResumePage(prevPage);
    });
  }

  // 6. Contact Action
  const contactBtn = document.getElementById('contactBtn');
  if (contactBtn) {
    contactBtn.addEventListener('click', () => {
      contactBtn.textContent = "Email copied! Let's connect ☕";
      contactBtn.classList.add('is-connected');
      navigator.clipboard.writeText('adityapandya905@gmail.com').catch(() => {});
    });
  }
});