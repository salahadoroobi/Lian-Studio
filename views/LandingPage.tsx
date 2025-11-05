import React, { useState } from 'react';
import type { View } from '../App';
import { SparklesIcon } from '../components/icons/SparklesIcon';
import { WandIcon } from '../components/icons/WandIcon';
import { DocumentTextIcon } from '../components/icons/DocumentTextIcon';
import type { Language, TFunction } from '../hooks/useLocalization';
import { CombineIcon } from '../components/icons/CombineIcon';
import { PaintBrushIcon } from '../components/icons/PaintBrushIcon';
import { ShimmerWrapper } from '../components/ShimmerWrapper';
import { ActionButton } from '../components/ActionButton';
import { PencilRulerIcon } from '../components/icons/PencilRulerIcon';
import { RestorerIcon } from '../components/icons/RestorerIcon';
import { PhotoIcon } from '../components/icons/PhotoIcon';
import { VideoIcon } from '../components/icons/VideoIcon';
import { AudioIcon } from '../components/icons/AudioIcon';
import { TextIcon } from '../components/icons/TextIcon';
import { InformationCircleIcon } from '../components/icons/InformationCircleIcon';
import { CheckBadgeIcon } from '../components/icons/CheckBadgeIcon';
import { FlagIcon } from '../components/icons/FlagIcon';
import { Squares2X2Icon } from '../components/icons/Squares2X2Icon';
import { WriterIcon } from '../components/icons/WriterIcon';
import { TranslatorIcon } from '../components/icons/TranslatorIcon';
import { ProofreaderIcon } from '../components/icons/ProofreaderIcon';
import { StealthIcon } from '../components/icons/StealthIcon';
import { SummarizerIcon } from '../components/icons/SummarizerIcon';
import { TextExtractorIcon } from '../components/icons/TextExtractorIcon';
import { StudioIcon } from '../components/icons/StudioIcon';
import { StudioCard } from '../components/StudioCard';

interface LandingPageProps {
  setView: (view: View, options?: { initialPrompt?: string }) => void;
  t: TFunction;
  language: Language;
  visibleCards: number;
  setVisibleCards: React.Dispatch<React.SetStateAction<number>>;
}

type ContentType = 'studio' | 'images' | 'videos' | 'audio' | 'text';
type InfoTab = 'about' | 'why' | 'mission' | 'features';

const studioCardsData = [
    {
        imageUrl: "https://i.postimg.cc/T3rjbcf5/lian-studio-1761606593324.png",
        prompt: "A moody, cinematic photorealistic portrait of a confident man with black hair and beard like the uploaded photo. He sits at a wooden table in a dim office room, lighting a thick cigarette with a classic lighter. Dressed in a dark velvet blazer, sunglasses, and silver watch, he exudes power and control. Warm flame light creates dramatic chiaroscuro, high contrast, and a rich, golden moody atmosphere."
    },
    {
        imageUrl: "https://i.postimg.cc/gJ6vK9ZQ/lian-studio-1761606885137.png",
        prompt: "A black-and-white aesthetic portrait of a stylish me(use my image with accurate face 100%) sitting on the floor in dramatic lighting. He is wearing an oversized dark coat. His pose is emotional and introspective, with one hand near his mouth and his head slightly turned to the side. Shadows from a window fall across the wall behind him, creating a moody and artistic atmosphere. The overall vibe is mysterious, emotional, and cinematic."
    },
    {
        imageUrl: "https://i.postimg.cc/wvBrxjnT/lian-studio-1761607346096.png",
        prompt: "Ultra-photorealistic cinematic portrait of a South Asian man (1:1 likeness) sitting on a modern chair in a dark abstract studio. Red light glows faintly from behind, creating bold shadows and smoke effects. Outfit: sleek all-black fashion with layered silver chains, round sunglasses. He leans back casually, one leg extended forward, gaze locked directly on camera with supreme confidence. 8K photorealistic cinematic look."
    },
    {
        imageUrl: "https://i.postimg.cc/x1t7wmF7/lian-studio-1761607492367.png",
        prompt: "Hands in pockets - relaxed authority. A\nhyper-realistic cinematic editorial\nportrait of the uploaded person (preserve face 100%. He stands tall in a dark, moody studio, facing the camera under a dramatic spotlight, with soft drifting smoke creating atmosphere. Outfit: all-black luxury suit with a slightly unbuttoned black silk shirt. Both hands casually tucked in pockets,\nshoulders relaxed, confident expression, head tilted slightly upward.\nStrong contrast lighting enhances\ntextures and depth, photorealistic 8K\ndetail, high-fashion editorial vibe."
    },
    {
        imageUrl: "https://i.postimg.cc/VNJ72Vt6/lian-studio-1761607616042.png",
        prompt: "A HYPER-REALISTIC PORTRAIT OF A YOUNG MAN\nSITTING ON LARGE SMOOTH WHITE ROCKY\nFORMATIONS UNDER NATURAL SUNLIGHT. HE IS\nWEARING A LOOSE, SLIGHTLY CRUMPLED BEIGE\nLINEN SHIRT WITH THE TOP BUTTONS OPEN,\nPAIRED WITH WIDE WHITE TROUSERS. HIS SHIRT\nGIVES A RELAXED SUMMER VACATION VIBE. HE\nIS LEANING BACK CASUALLY WITH ONE ARM\nRESTING ON THE ROCK AND THE OTHER ON HIS\nKNEE, LOOKING SLIGHTLY TO THE SIDE. HE IS\nWEARING SLIM BLACK RECTANGULAR\nSUNGLASSES, AND HIS HAIRSTYLE IS SHORT,\nSLIGHTLY MESSY, AND NATURAL. THE SUNLIGHT\nCASTS SOFT SHADOWS ACROSS HIS OUTFIT\nAND THE TEXTURED ROCKS. THE OVERALL\nATMOSPHERE IS CALM, STYLISH, AND\nMEDITERRANEAN-INSPIRED. THE FACE SHOULD\nMATCH EXACTLY WITH THE REFERENCE\nPHOTO."
    },
    {
        imageUrl: "https://i.postimg.cc/zB1cWkLk/lian-studio-1761608300245.png",
        prompt: `"A hyper-realistic cinematic black-and-white portrait of the user standing in an open field, shot from an extreme low angle looking slightly upward, creating a dramatic towering silhouette. He is wearing a long dark overcoat with both hands in his pockets, standing perfectly still with an intense, stoic expression.\n‎Take only the exact facial features from the user's reference photo — preserve all face proportions, skin tone, and hairstyle exactly. Ultra-consistent identity across all generations.\n‎Hundreds of pigeons are frozen mid-flight around him, with some close to the camera wings blurred for depth and motion, others far away forming a scattered pattern across the cloudy, overcast sky. The foreground birds should frame the subject naturally, creating a sense of movement and chaos around his stillness.\n‎Lighting is soft but contrasty, with deep shadows and clean highlights — think fine art black-and-white photography. Subtle fine 35mm film grain, Leica M11 + Summicron lens look, sharp subject focus with slightly softer vignette edges. Hyperdetailed 8k super-resolution, moody and editorial fashion campaign atmosphere, timeless and surreal."`
    },
    {
        imageUrl: "https://i.postimg.cc/J0zKcYRJ/lian-studio-1761608380944.png",
        prompt: `"Edit the uploaded image with high precision. Keep everything exactly as it is: I am standing in a three-quarter pose, my body slightly turned to the left with my right shoulder closer to the camera. My head is turned slightly towards the camera, looking directly with a confident expression. My right hand is raised, touching the edge of the keffiyeh or garment on the shoulder, while my left arm rests naturally by my side. I am wearing a black shirt with my sleeves rolled up, a Rolex watch, and sunglasses. The black and white Palestinian keffiyeh is wrapped around my neck, flying backward in the wind. The background shows the Dome of the Rock in Jerusalem and the Old City walls, with warm golden lighting. Maintain the precise facial features, beard, skin tone, and expression."`
    },
    {
        imageUrl: "https://i.postimg.cc/1z0Hx1tw/lian-studio-1761608419028.png",
        prompt: `Ultra photo-realistic 8K lifestyle portrait of a man leaning casually against a rustic textured brick wall. He is wearing a premium knit sweater and a modern wristwatch. Warm natural daylight enhances the earthy brick tones and the soft fabric texture with cinematic richness. The man poses with relaxed confidence, looking slightly toward the camera with a subtle natural expression. Perfect shallow depth of field with creamy bokeh, tack-sharp focus on the subject, crisp details in hair, skin, and clothing fibers. Professional editorial fashion photography style, high-end magazine aesthetic, ultra-clean composition.`
    },
    {
        imageUrl: "https://i.postimg.cc/qRb20JdC/lian-studio-1761608511064.png",
        prompt: `"A cinematic 3:4 portrait of the user standing completely still at the center of a busy city street during golden hour, bathed in soft diffused sunlight.\nTake the exact facial features from the user's reference photo — preserve all face proportions, skin tone, and hairstyle exactly, do not alter or morph the face, ultra-consistent identity across all generations.\nWardrobe: minimalist beige wool coat, open over a simple neutral-toned outfit.\nPose: eyes gently closed, calm and serene expression, hands relaxed by the sides, radiating stillness and confidence.\nEnvironment: tall urban buildings frame the background, bathed in warm evening light. Yellow taxis glide by, catching golden reflections, while streetlights and traffic signals glow softly.\nMotion: crowd around him captured in dramatic radial motion blur, creating a surreal "time stands still" effect that contrasts with his perfect stillness.\nComposition: eye-level perspective with 50mm lens compression, shallow depth of field (f/1.😎, sharp focus on the user, softly blurred background.\nLighting: warm cinematic golden hour glow, natural flares and soft shadows enhancing depth and textures.\nMood: introspective, calm, poetic — highlighting the beauty of stillness amid chaos.\nTechnical: Leica M11 look, hyperdetailed 8k super-resolution, fine cinematic grain, natural urban color palette with warm highlights and subtle teal shadows."`
    },
    {
        imageUrl: "https://i.postimg.cc/wBFmcqMQ/lian-studio-1761608582598.png",
        prompt: `"A hyper-realistic cinematic 4K full-body portrait of the user seated gracefully on a plush velvet beanbag chair in a warm, dimly lit vintage-style room.\nTake the exact facial features from the user's reference photo — preserve all face proportions, skin tone, and hair style exactly, do not alter or morph the face, ultra-consistent identity across all generations.\nWardrobe: camel brown blazer draped effortlessly over a fitted black turtleneck, paired with tailored light plaid trousers and polished black loafers, capturing a refined 1970s-inspired editorial style.\nPose: legs slightly apart, leaning subtly to one side with a contemplative, serious expression, gaze cast downward to evoke introspection and depth.\nEnvironment: rich brown textured wood paneling on the walls, muted beige carpet beneath, evoking retro-luxury interiors.\nA large vintage floor lamp in the top right corner casts a focused warm glow, creating a cone of directional light that pools softly across the subject and room, with dramatic shadow falloff adding depth.\nAtmosphere: cinematic and moody, golden amber tones bathing the room, subtle haze or dust particles visible in the light beam to add warmth and realism.\nComposition: eye-level framing with symmetrical balance, ensuring the subject is the visual anchor, velvet beanbag texture and sharp suit tailoring rendered with lifelike detail.\nCamera: Leica SL2 + 50mm Summilux lens, f/1.8 for shallow depth of field, creamy bokeh where necessary, crisp focus on the subject.\nQuality: hyperdetailed 8K super-resolution, ultra-clean fabric textures, realistic shadow gradients, fine 35mm film grain for a timeless edit`
    },
    {
        imageUrl: "https://i.postimg.cc/g0MKcqVb/lian-studio-1761608667675.png",
        prompt: `A man sitting on a wooden chair in a dimly lit vintage room. He wears a skin-colored oversized jacket. Sunlight filters through window blinds, casting dramatic stripes across his face and the wall. The atmosphere is nostalgic and contemplative, with a soft golden hue and warm tones. The lighting highlights his facial features against a dark background. Maintain the same face. Vertical composition, 3:4 ratio.`
    },
    {
        imageUrl: "https://i.postimg.cc/hjd7F9M9/lian-studio-1761608724546.png",
        prompt: `"A dramatic black-and-white editorial portrait of the user sitting on a simple chair, leaning slightly forward with his head resting on one hand in a contemplative pose. He is wearing a pinstripe suit with a relaxed open-collar shirt underneath. His expression is intense and pensive, with sharp light emphasizing the angles of his face.\nTake only the exact facial features from the user's reference photo - preserve all face proportions, skin tone, and hair style exactly. Do NOT copy clothing from the reference, use the clothing/style described in the prompt. Ultra-consistent identity across all generations.\nStrong studio lighting from one side casting deep shadows across the face and body, creating high contrast and a moody noir effect. Minimal seamless background with soft gradient light, Leica SL2 medium format look, IMG_9961.CR2, hyperdetailed 8k super-resolution, fashion magazine editorial aesthetic."`
    },
    {
        imageUrl: "https://i.postimg.cc/85ST5MNv/lian-studio-1761608888648.png",
        prompt: `Cinematic vintage portrait, stylish man with straw hat and beige oversized coat, sitting on wooden chair. Dramatic warm sunlight through blinds casting striped shadows on face and body. Rustic room with floral wallpaper, nostalgic atmosphere, editorial photography style, moody golden tones."`
    },
    {
        imageUrl: "https://i.postimg.cc/Pxt094tT/lian-studio-1761608973964.png",
        prompt: `An elegant man sits on modern concrete steps in a trendy urban setting. He is wearing a light beige sweater with a slightly loose fit and a soft texture, paired with similar cream-colored, smart, straight-cut trousers. The shoes are light beige leather or suede loafers, with no visible socks. The lighting is soft and natural, and the scene exudes simplicity yet sophistication. The facial expression is calm and confident, with hands gently clasped and a focused gaze forward. The background is modern, with a metal and glass design that creates a clean, contemporary feel.`
    },
    {
        imageUrl: "https://i.postimg.cc/DfpRpLRf/lian-studio-1761609002997.png",
        prompt: `A stylish young man stands confidently in front of a large, light brown wooden door, wearing a stylish brown leather jacket over a black shirt or top, black skinny pants, a black belt, and dark brown leather dress shoes. He wears black sunglasses and appears to have a classic, sophisticated style inspired by European autumn fashion. The lighting is natural and the weather is sunny.`
    },
    {
        imageUrl: "https://i.postimg.cc/m2kDH3Wk/lian-studio-1761612500378.png",
        prompt: "A cinematic portrait of a man with short curly hair and trimmed beard, wearing round glasses and a black sweater. He is posing with a grey British Shorthair cat resting on his shoulder. The man looks directly at the camera with a serious expression, while the cat's amber eyes are also staring forward. The background is a dramatic orange gradient halo fading into black, with studio lighting creating strong contrast and depth. High resolution, sharp focus, professional studio photography style."
    },
    {
        imageUrl: "https://i.postimg.cc/KcJjjqVD/lian-studio-1761612545580.png",
        prompt: "same the of photoshoot fashion Ultra-realistic his preserving ,image reference the from man glasses and ,tone skin ,hairstyle ,features facial wheat golden a in standing is He .resent. if vibrant a wearing ,sunlight natural under field wide-leg with paired shirt orange-yellow shot The .ook. stylish and modern a for trousers with ,pose fashion creative a in him captures the of texture the highlighting lighting cinematic shows background The .lothing. his and wheat creating ,sky bright a and fields golden endless atmosphere The .ood. editorial yet natural a ,fashion-forward and ,artistic ,refreshing feels contemporary with scene rural the blending and ,details clean ,sharpness High .esign. .omposition. cinematic"
    },
    {
        imageUrl: "https://i.postimg.cc/fWByy2F2/lian-studio-1761612568043.png",
        prompt: "Male model in oversized Black sweatshirt and sweatpants with White sneakers, [model wearing black sunglasses with rounded lenses], seated elegantly on a throne in the color Black Golden, against a soft White Pastel dark studio backdrop, [Giant White Tiger lying in front of the model, Tiger with a crown on the head]. Cinematic lighting, futuristic editorial style, relaxed posture, head slightly tilted. And please don't change my face"
    },
    {
        imageUrl: "https://i.postimg.cc/NGpFFJVp/lian-studio-1761612592659.png",
        prompt: "Ultra-realistic lifestyle portrait of a young man posing casually against a plain wall with strong sunlight casting sharp shadows. He is wearing a fitted dark polo shirt and light blue jeans, accessorized with a stylish wristwatch. The photo should look completely natural with no changes to facial features or identity. Cinematic natural lighting, high detail, editorial photography style, clean background, authentic and realistic look"
    },
    {
        imageUrl: "https://i.postimg.cc/8cKzYcMJ/lian-studio-1761612684112.png",
        prompt: `"Stylish fashion editorial photo of a male model wearing an oversized white sweatshirt and white sweatpants, paired with white sneakers. A soft red studio backdrop with soft cinematic lighting, highlighting textures, futuristic editorial style, model sitting elegantly, head slightly tilted, relaxed posture."`
    },
    {
        imageUrl: "https://i.postimg.cc/Jn0gqhrG/lian-studio-1761612966400.png",
        prompt: "Ultra-realistic portrait of a stylish man standing confidently on the beach during golden hour sunset, wearing a white open-collar shirt, rolled-up beige pants, straw hat, and wristwatch, hands in pockets, soft waves around his feet, cinematic lighting, sharp focus, detailed skin texture, warm tones, serene ocean horizon in the background, 8K high resolution, photorealistic style."
    },
    {
        imageUrl: "https://i.postimg.cc/SKD3C9hy/lian-studio-1761612986144.png",
        prompt: "“A stylish young man sitting confidently on a white bean bag chair in a minimal all-white studio background. He is dressed in a full monochrome white outfit: puffer jacket, hoodie, jogger pants, and modern white boots. He wears futuristic rectangular white sunglasses, giving a bold urban fashion look. The lighting is clean and bright, highlighting the textures of the clothing and creating a high-fashion editorial style. Ultra-realistic, 8K, highly detailed.”"
    },
    {
        imageUrl: "https://i.postimg.cc/k5fzKSmd/lian-studio-1761613007169.png",
        prompt: "“A young man sitting confidently on a wooden chair in a room covered with Egyptian newspapers on the walls, featuring images of famous Egyptian actors and singers. Urban streetwear style, wearing a white oversized sweater vest layered over a long-sleeve shirt, dark loose-fit jeans, chunky white sneakers, and a black bandana on his head. Warm cinematic lighting with a retro atmosphere, detailed textures, ultra-realistic, 8K, highly detailed.”"
    },
    {
        imageUrl: "https://i.postimg.cc/FKD83S4N/lian-studio-1761613029946.png",
        prompt: "Hyperrealistic portrait in the foreground of the image's face (keep facial features as close as possible, as far as you allow) with only the left half visible and partially submerged in water. The scene is dramatically illuminated with ambient light from blue and pink neon that projects colorful reflections onto your damp skin/hair. Drops of water and small bubbles stick to your face, bringing Out the cinematic atmosphere. Skin texture and intense concentration of the gaze are clearly visible"
    },
    {
        imageUrl: "https://i.postimg.cc/JhPvZXWv/lian-studio-1761613052662.png",
        prompt: "رقم 8.9 مع تغير الالوان : \"Stylish fashion editorial photo of a male model wearing an oversized sweatshirt and sweatpants, paired with sneakers. A soft red studio backdrop with soft cinematic lighting, highlighting textures, futuristic editorial style, model sitting elegantly, head slightly tilted, relaxed posture. Do not change the facial features at all, and do not approach the face at all."
    },
    {
        imageUrl: "https://i.postimg.cc/8c1bHKB9/lian-studio-1761613240926.png",
        prompt: "A stylish man from attached photo with voluminous, well-styled hair and clean-shaven, smooth look, sitting casually on a modern chair against a plain background. He is wearing a deep classic black jacket over a black outfit, and jeans black ..accessorized with a wristwatch. He holds a pair of sunglasses near his lips in a confident, charismatic pose, exuding modern elegance and charm. The image should be hyper-detailed with sharp focus on the subject, rich color grading, and have a cinematic quality.use reference face"
    },
    {
        imageUrl: "https://i.postimg.cc/nzKkqb7Q/lian-studio-1761613261298.png",
        prompt: "In a lavish, dimly lit room, a powerful man (as pictured), dressed in a smart brown suit, dominates the scene from a plush black leather chair, his hands clasped in an aura of quiet confidence. Behind him, four powerful bodyguards in smart black suits stand as stern sentries. In front of him, a majestic\nlion and black panther recline peacefully on the polished dark wood floor, their presence adding to the room's mystique. Crystal chandeliers suspended from the high ceiling cast a warm, ambient glow, illuminating the rich fabrics of the luxurious setting. The atmosphere is one of silent power, a palette of quiet authority and luxurious comfort. Don't change the face."
    },
    {
        imageUrl: "https://i.postimg.cc/3RjB25p0/lian-studio-1761613298623.png",
        prompt: "6 Ultra-realistic fashion editorial photoshoot of a male model (keep same face & hairstyle as uploaded photo, do not change facial expression).\nOutfit: oversized textured white sweatshirt (slightly structured fabric), futuristic oversized combat jeans in muted neon lemon-green with exaggerated silhouette.\nFootwear: lemon-green Nike sneakers with bold sole details, styled with white ribbed socks.\nPose: model seated on a sleek modern metallic cube, elegant yet relaxed posture, one arm resting casually, gaze slightly off-camera.\nEnvironment: futuristic muted lemon-green gradient studio background with subtle geometric light streaks.\nLighting: cinematic soft glow with subtle rim-light highlighting skin contours and fabric textures, fashion magazine quality.\nStyle: futuristic x editorial, clean minimalism with avant-garde vibe"
    },
    {
        imageUrl: "https://i.postimg.cc/Jn3qjVJy/lian-studio-1761613331120.png",
        prompt: "4 A dramatic close-up, low-key, cinematic portrait of a young man wearing a black turtleneck. He is sitting on a wooden chair, facing forward with his arms crossed over the chair's back. The scene is lit by a single, harsh, side light that casts long, parallel shadows across his face and body, mimicking the pattern of window blinds. The background is a plain, dark wall. The colors are muted and monochromatic, with high contrast between light and shadow. The photo style is high-resolution and sharp."
    },
    {
        imageUrl: "https://i.postimg.cc/MT0D12RX/lian-studio-1761613353081.png",
        prompt: "3 : Ultra-realistic artistic portrait of the model in the reference photo, preserving all real features. [same face as in the submitted photo], [do not alter the face in the submitted photo], wearing a stylish black sweatshirt, hair glowing with golden backlighting, contrasted by cool green light on the face and chest, against a deep black background. The model is posed slightly in profile, head turned gently to the side with a thoughtful expression, avoiding direct eye contact with the camera Do not change the facial features at all, do not approach the face at all, and do not change the hairstyle"
    },
    {
        imageUrl: "https://i.postimg.cc/Wbst4GzF/lian-studio-1761616074047.png",
        prompt: `The image shows a young man sitting on a white cubic object, against a red gradient background. He is wearing a white sweatsuit, consisting of a crewneck sweatshirt and sweatpants, paired with white sneakers. His hair is short and dark. He is looking directly at the camera. The lighting is studio-style, creating soft shadows.\nYoung Man in White Sweatsuit, A young man is seated on a white cube positioned at an angle to the camera, with his gaze directed forward, the backdrop consists of a vibrant gradient transitioning into red hues, he is dressed in a matching white sweatsuit and sneakers, showcasing a minimalist aesthetic, the instruction is to render the subject within a studio-style lighting arrangement with attention to capturing the texture of the clothing and the soft gradation of the backdrop, also maintain the direct eye contact for an engaging portrait.`
    },
    {
        imageUrl: "https://i.postimg.cc/hv1jrjyQ/lian-studio-1761616638506.png",
        prompt: `A very realistic black and white photograph of the same man in these photos, without changing his facial features. He is confident and seated on a chair, wearing a tight black suit with a button-down shirt slightly open at the collar. All facial expressions are captured without changing his face, but rather making him look real in these photos. He casually places one hand on his thigh, while the other is in his pocket, revealing a wristwatch. The man stares directly into the camera with a serious and thoughtful expression. The studio lighting creates strong contrast and soft shadows, highlighting the texture of the suit and natural skin tone. The background is dark, soft, and simple, creating a sophisticated cinematic atmosphere. The overall style is elegant, modern, and in keeping with the latest fashion trends.`
    },
    {
        imageUrl: "https://i.postimg.cc/qRngNQ2X/lian-studio-1761616657359.png",
        prompt: `A hyper-realistic cinematic portrait of the same person sitting confidently on an ornate golden royal throne, upholstered in black leather. His face, as seen in the photograph, remains unaltered, wearing black sunglasses, formal black clothing, and white sneakers. His hands rest firmly on the carved golden armrests, exuding authority and power. Beside him on the ground lies a majestic white Bengal tiger with piercing blue eyes, wearing an ornate golden crown studded with green and red gemstones. The tiger appears regal and calm, symbolizing power and royalty. The background is a dark, tonal studio setting, with soft, dramatic lighting, creating a powerful and regal atmosphere. High resolution, with extreme detail in the texture of the leather, fur, fabric, and gold engravings. Perfect symmetry and cinematic shadows enhance his dominance and regal elegance.`
    },
    {
        imageUrl: "https://i.postimg.cc/SKnnhms5/lian-studio-1761616680422.png",
        prompt: `A confident man standing on a tropical beach with turquoise water and white sand. He has a well-groomed short beard and dark styled hair. He is wearing a white unbuttoned shirt with rolled-up sleeves, exposing part of his chest and a silver chain necklace. He also wears a silver wristwatch and aviator sunglasses, holding the sunglasses with one hand as if adjusting them. The background shows luxury overwater bungalows on stilts above the sea, with clear blue sky and soft natural sunlight. The photo has a cinematic, high-quality vacation vibe.\n\nStyle keywords: realistic, sharp focus, cinematic portrait, vibrant colors, luxury beach resort, sunny atmosphere.`
    },
    {
        imageUrl: "https://i.postimg.cc/W1WdCd21/lian-studio-1761616704640.png",
        prompt: `A confident man standing inside a modern stainless steel elevator, wearing a sleek all-black outfit: tailored black suit, black dress shirt slightly unbuttoned, and black trousers. He has short neatly styled hair, a trimmed beard, and is wearing stylish black sunglasses. The man holds a black takeaway coffee cup in his right hand while his left hand rests casually in his pocket. He also wears a silver wristwatch. The elevator has metallic walls, illuminated by bright ceiling lights, with a control panel of buttons on the right side. The overall atmosphere is elegant, stylish, and cinematic, giving off a powerful, sophisticated vibe.`
    },
    {
        imageUrl: "https://i.postimg.cc/XN5LcbVn/lian-studio-1761616762307.png",
        prompt: `Edit the uploaded photo in high resolution. Keep everything the same: I stand in a three-quarter pose, my body slightly to the left, and my right shoulder closer to the camera. My head is slightly turned toward the camera, looking directly at me with confidence. My right hand is raised, touching the edge of the keffiyeh on my shoulder, while my left arm lies naturally at my side. I am wearing a black shirt with rolled-up sleeves, a Rolex watch, and sunglasses. The black and white Palestinian keffiyeh is wrapped around my neck, flapping backward in the wind. The background shows the Dome of the Rock in Jerusalem and the Old City walls, in warm, golden light. Keep your facial features, beard, skin tone, and expression sharp, and don't overdo it.`
    },
    {
        imageUrl: "https://i.postimg.cc/GtvjckMT/lian-studio-1761616787387.png",
        prompt: `A cinematic portrait of a young man sitting on a stone wall during golden hour. He is wearing a red sweatshirt, dark jeans, and white sneakers. He has stylish hair, a short beard, and is wearing round black sunglasses and a large wristwatch. The sunlight behind him creates a warm golden glow with soft bokeh in the background, highlighting the details of his face and outfit. The atmosphere feels cool, confident, and modern, with a subtle urban vibe.`
    },
    {
        imageUrl: "https://i.postimg.cc/C5b4Fjvy/lian-studio-1761616806632.png",
        prompt: `Hyper ultra realistic 8K portrait of a 5ft 6in light-skinned man with short dark hair (face unchanged from reference), walking on a rocky shoreline or sandy beach, wearing a yellow semi-sheer half-sleeve button-down shirt, white pants, watch, and frameless sunglasses.`
    },
    {
        imageUrl: "https://i.postimg.cc/d3G9q8W7/lian-studio-1761616926151.png",
        prompt: `Ultra-realistic full-body shot of a 20-year-old handsome boy sitting on a chair in a modern café. Wearing a muted olive-green rolled-sleeve button-up shirt (unbuttoned at the top), relaxed white linen pants, white sneakers, sunglasses, and a watch. One hand in pocket, the other holding a dark beverage in a clear cup, leaning slightly. Background: light wood shelves with coffee items, pastry display case, and counter with glasses. Keep face exactly the same.`
    },
    {
        imageUrl: "https://i.postimg.cc/Hxq2DS9F/lian-studio-1761616949199.png",
        prompt: `A surreal, ethereal scene of a person walking calmly on a mirror-like water surface that perfectly reflects the sky and clouds. The person is wearing clean white casual shirt and walking barefoot, with gentle ripples forming around their feet. The sky is bright blue with fluffy white clouds, creating a feeling of peace and divinity. The reflection in the water is crystal clear, showing a perfect mirror image of the person and the clouds. The overall mood is serene, pure, and dreamlike.`
    },
    {
        imageUrl: "https://i.postimg.cc/WzsdkgNg/lian-studio-1761616973763.png",
        prompt: `A cinematic portrait of a young man sitting on a grassy field, leaning slightly to one side with a black acoustic guitar resting beside him. He is wearing a white t-shirt layered with a checkered blue and white shirt, light blue jeans, and brown loafers. The background is filled with tall green trees and a clear blue sky, giving a peaceful and natural outdoor vibe. The lighting is soft and natural, highlighting his calm and confident expression. The overall style is realistic, bright, and artistic with a professional photography feel.\n\nStyle: cinematic, realistic, natural light, outdoor photography, portrait shot\nAspect Ratio:`
    },
    {
        imageUrl: "https://i.postimg.cc/mDYck8sx/lian-studio-1761617068775.png",
        prompt: `A cinematic 9:16 portrait of a young man (your face) sitting casually on a rooftop ledge against a bright blue sky with soft clouds. He is wearing a dark t-shirt layered with a blue and green checkered shirt, black jeans, and white sneakers. His pose is relaxed and natural — sitting cross-legged, resting his cheek on one hand with a gentle, confident smile. The lighting is soft and natural, with a daylight tone that enhances the calm and peaceful mood. The overall vibe is friendly, youthful, and aesthetic — perfect for a casual outdoor portrait with sky background and warm natural tones.`
    },
    {
        imageUrl: "https://i.postimg.cc/rm1dsQL7/lian-studio-1761617099830.png",
        prompt: `Edit this image of the man. He is wearing black a White baggi shirt black White. Baggi shoes, and.: left hand in pocket, right hand resting casually on his knee. The man is sitting on the hood of a black and. Fortuner. The license plate 'JAYU" is clearly visible on the front of the car. The background shows mountains or hills covered in thick fog, And Hair Same as my uploaded Photo 18 years boy Face reference 100%`
    },
    {
        imageUrl: "https://i.postimg.cc/nz4sr0tW/lian-studio-1761617125788.png",
        prompt: `A man wearing Ihram is distributing date packets from one hand to a crowd of people, holding more date packets in his other hand. The man in the Ihram is smiling and looking at the person he is giving the dates to. He has the exact face from the uploaded photo. He is also wearing a small black shoulder bag. This is a half-body shot with a large crowd gathered to receive the dates. The image should be of DSLR camera quality with high resolution and bokeh effect.`
    },
    {
        imageUrl: "https://i.postimg.cc/FsDL0WJX/lian-studio-1761617152595.png",
        prompt: `A close-up, highly detailed, hyper-realistic portrait of a handsome young man. He is wearing a red sweatshirt and black trousers, sitting on the floor or a low stool directly in front of a modern, stylish bed. He has an intense, focused gaze. He is holding a large, non-venomous snake (like a python or boa constrictor) coiled gently around his hands or shoulders. The main light source is a vibrant neon light strip (e.g., electric blue and magenta) installed behind the headboard of the bed, creating a strong rim light and a modern, dramatic cyberpunk-like atmosphere. The room is dimly lit, emphasizing the glow of the neon. Sharp focus on the man and the snake, detailed skin texture and snake scales, volumetric lighting, cinematic lighting, 8k, photorealistic.`
    },
    {
        imageUrl: "https://i.postimg.cc/zX0gTtHQ/lian-studio-1761617180838.png",
        prompt: `A hyper-realistic portrait of a young man standing confidently in front of the Abu Simbel Temple in Egypt, during a bright, clear morning. The massive ancient statues of Pharaoh Ramses II are visible in the background, carved into the sandstone cliffs. The man is wearing a light beige open shirt over a plain white T-shirt, with dark jeans and a silver wristwatch. His hands are casually in his pockets, and he’s facing slightly to the side with a relaxed, composed expression.\nHe has no beard, clean-shaven face, neatly styled short dark hair, and is wearing black sunglasses.\nThe lighting is natural and warm, casting soft shadows on his face and body. The overall tone of the image is golden and cinematic, with fine texture details in the temple stone and desert sand.\nUse the facial features from the uploaded reference photo for accurate resemblance, maintaining the same hairstyle, facial expression, and posture.\nultra-realistic, 8k, cinematic lighting, warm desert tones, clear sky, natural skin texture, soft back`
    },
    {
        imageUrl: "https://i.postimg.cc/44vtxNfn/lian-studio-1761617205386.png",
        prompt: `A close-up, highly realistic portrait of a young man. He is wearing a black jacket, with slightly bright lighting. He holds a terrifying doll in his hands, and the doll is actively on fire. The flames cast an eerie, warm glow on parts of his face and the doll. His expression is a complex mix of fear and unsettling calmness. The background is softly blurred to keep the focus on him and the burning doll. High detail, photorealistic, shallow depth of field, dramatic lighting, warm and cool color contrast, smoke.`
    },
    {
        imageUrl: "https://i.postimg.cc/bY0bwNyw/lian-studio-1761617227212.png",
        prompt: `A young man adjusting a circular LED ring light in a dark studio setting. He is wearing a red patterned long-sleeve shirt, and the light from the ring creates a soft glow on his face. The background is dark teal or black, giving a cinematic and moody atmosphere. The lighting emphasizes his facial features and hands as he carefully adjusts the ring light. Professional portrait photography style, sharp focus, high contrast, dramatic lighting, shallow depth of fiel`
    },
    {
        imageUrl: "https://i.postimg.cc/90Bq818L/lian-studio-1761617314174.png",
        prompt: `A young woman adjusting a circular LED ring light in a dark studio setting. She is wearing a red patterned long-sleeve shirt, and the light from the ring creates a soft glow on her face. The background is dark teal or black, giving a cinematic and moody atmosphere. The lighting emphasizes her facial features and hands as she carefully adjusts the ring light. Professional portrait photography style, sharp focus, high contrast, dramatic lighting, shallow depth of field.`
    },
    {
        imageUrl: "https://i.postimg.cc/qqr3xWLg/lian-studio-1761617338862.png",
        prompt: `Editorial fashion portrait, medium close-up shot, Canon EOS 5D Mark IV with 35mm f/1.8 lens, [Based on photo uploaded, don't change the face] wear a dark t-shirt lying in water surrounded by floating cherry blossoms flowers, glossy wet skin with dramatic light refractions, natural lip color, natural fresh look, cinematic golden hour lighting reflecting ripples across his face dark aquatic background filled with flowers, luxury skincare commercial vibe -ar 2:3\n-v 6 -q 5-s 750--style raw`
    },
    {
        imageUrl: "https://i.postimg.cc/3W50xVkz/lian-studio-1761661070070.png",
        prompt: `A black and white portrait of a man intensely focused on a chessboard in front of him. He is leaning forward, resting his chin on his clasped hands, which show a wristwatch. The chess pieces are made of transparent material, possibly glass or acrylic. The man is dressed in a dark suit, and the background is softly blurred, with framed artwork visible. The lighting creates a dramatic and thoughtful atmosphere.`
    },
    {
        imageUrl: "https://i.postimg.cc/xd0Hmw6c/lian-studio-1761661129657.png",
        prompt: `From the original image, create an attached image. The face looks 100%. Do not edit. Good woman. Wear an unbuttoned black shirt to see the chest hill. Cylindrical khaki slack pants. Small legs floating above the shoes. Wear white original adidas shoes. Silver aunt stripe. One hand holds a glass. 20 oz. Clear plastic afaceon with black lid and tube. Stand against the wall, suck tea. Coffee posture. Cross-legged bottom in front of the cafe. Brickmould. Full-body image. Atmospheric background. Amazon storefront. Vibrant morning atmosphere. Gives a sense of stylish street fashion. Realistic, crisp, realistic image.`
    },
    {
        imageUrl: "https://i.postimg.cc/Y2V1PyCx/lian-studio-1761661154501.png",
        prompt: `From the original image, create an attached image. The face looks 100%. Do not edit. Good man. Wear an unbuttoned black shirt to see the chest hill. Cylindrical khaki slack pants. Small legs floating above the shoes. Wear white orisinal adidas shoes. Silver aunt stripe. One hand holds a glass. 20 oz. Clear plastic afaceon with black lid and tube. Stand against the wall, suck tea. Coffee posture. Cross-legged bottom in front of the cafe. Brickmould. Full-body image. Atmospheric background. Amazon storefront. Vibrant morning atmosphere. Gives a sense of stylish street fashion. Realistic, crisp, realistic image.`
    },
    {
        imageUrl: "https://i.postimg.cc/LsTt09Jj/lian-studio-1761661278361.png",
        prompt: `A close-up, intimate shot based on my uploaded photo, featuring the same facial features. She is wearing a red jacket, with her eyes closed, gently embracing a white cat with thick, soft fur. Both appear to be in a state of complete calm and deep relaxation, their eyes closed as if enjoying a moment of profound serenity and affection. The lighting is characterized by a dark room with an illuminated LED bulb overhead, highlighting the scene's purity and tranquil beauty. The focus is sharp on the faces, creating a sense of warmth and intimacy.`
    },
    {
        imageUrl: "https://i.postimg.cc/GpQFSL4P/lian-studio-1761661314933.png",
        prompt: `Create a sharp and realistic portrait of a man whose face is exactly the same as in the uploaded reference photo, ensuring full likeness and identity. The man’s body is toned and active. He is casually leaning against a concrete wall in an urban setting, wearing white thobe, asib, jambiya dagger and shawl around his sholders . He wears stylish sunglasses and looks confidently over his shoulder.`
    },
    {
        imageUrl: "https://i.postimg.cc/zfjCPzy3/lian-studio-1761661359310.png",
        prompt: `Reference: Use the uploaded user photo labeled "face_ref" as the sole facial reference. Preserve the user's identity exactly; do NOT alter facial features, age, ethnicity, or expression. Integrate face_ref seamlessly with scene lighting and perspective.\nCreate one hyper-realistic photograph of the subject in an urban location (sidewalk ledge, graffiti wall behind, wet asphalt foreground with night reflections).\nPose & Vehicle:\n- Subject seated confidently on a modern, sleek, high-end motorcycle (matte black with chrome details). The motorcycle is stationary (not moving).\n- One foot rests firmly on the motorcycle’s foot peg, while the other foot is planted strongly on the wet asphalt ground.\n- The overall body posture is relaxed but confident, suggesting quiet danger and control. Hands may rest casually on the handlebars or on thighs, not gripping aggressively.\nCamera & perspective:\n- Extreme low camera height ~8–15 cm (3–6 in) from the ground.\n- Wide-angle lens ~20mm focal length.\n- Camera aimed slightly upward at subject’s body, maintaining dramatic foreshortening effect.\n- Slight horizontal offset (camera not perfectly centered) to emphasize perspective distortion.\n- Ensure natural wide-angle distortion consistent with ~20mm lens.\nDepth of field:\n- Aperture f/5.6 (or similar) to balance: sharp detail on subject’s face while gently softening background graffiti and asphalt reflections.\n- DO NOT blur the face. Facial details from face_ref must remain crisp and photorealistic.\nLighting & environment:\n- nighttime cinematic setup.\n- Cool blue rim lights along subject and bike edges.\n- Wet asphalt reflects neon glows and graffiti colors.\n- Graffiti wall remains vibrant but softly defocused to keep attention on subject.\nClothing & accessories:\n- Maroon fitted t-shirt, distressed gray jeans, gray canvas sneakers with scuffs, leather strap watch on left wrist, bracelets on right.\nTechnical details:\n- Output in 4k photoreal quality with realistic textures (canvas shoe fabric, asphalt wetness, chrome on motorcycle, skin pores).\n- Maintain original cinematic, moody atmosphere.\nConstraints:\n- DO use face_ref for the subject’s face only, preserving identity exactly.\n- DO NOT change clothes or accessories.\n- DO NOT crop out the motorcycle; it must appear as a clear, central part of the composition.\n- DO NOT blur or soften the subject’s face; all facial details must remain sharp and lifelike.`
    },
    {
        imageUrl: "https://i.postimg.cc/kMhcmgft/lian-studio-1761661526988.png",
        prompt: `A realistic studio-quality portrait of a young man sitting on a Yemeni-style patterned sofa, in a modern high-rise apartment. He is dressed in a light beige thobe, wearing a brown Jacket, wearing an authentic Yemeni dagger, a falcon on his shoulder, holding a modern smartphone in his right hand, and wearing classic round sunglasses. His skin is smooth, with a calm, confident, and contemplative expression, looking slightly away from the camera. Soft natural daylight diffused from a large window, shallow depth of field (85mm/2.😎 with a soft, blurry city skyline background. Highly detailed textures on the fabric and dagger, realistic skin pores, warm color grading. Cinematic images, high resolution, and realistic, without altering my facial features. Small personalized signature in the upper left corner of the mirror "waleed waeel"`
    },
    {
        imageUrl: "https://i.postimg.cc/3N6CCtdn/lian-studio-1761661562050.png",
        prompt: `Create a high-quality photograph of the same person in the attached full-length photo, standing confidently in a mountainous area on a sunny day. Man: Appearance: Same person as in the attached photo, wearing sunglasses that suit his style and face shape. Dress: Wearing a traditional headband similar to the one in the attached photo wrapped around his head. Wearing a traditional dark blue or navy thobe, the same headband as in the photo, and wearing a men's winter tactical softshell jacket. Pattern and color: Digital camo predominantly in shades of gray, white, and black (urban style).`
    },
    {
        imageUrl: "https://i.postimg.cc/QMkmGgyG/lian-studio-1761661590030.png",
        prompt: `Use my exact face for the attached high-resolution image without altering the features. A stylish and powerful portrait of a modern Arab man sitting in the driver's seat of a luxurious black SUV (most likely a Lexus Land Cruiser/LX Series). The subject is wearing dark, mirrored sunglasses that reflect the exterior. His clothing is a mix of traditional and modern: a crisp white thobe (thawb). Over the thobe is a sharp, tailored, and well-fitting chocolate or brown jacket/blazer with a cuff tucked into the right sleeve. A traditional decorative belt or sash is visible across his waist, featuring intricate gold and beige embroidery, and he holds a small, ornate dagger (jambiya) in a sheath. He wears a silver or metal watch on his left wrist (visible on the steering wheel). His stance is confident and relaxed, with his left hand resting lightly on the wood and leather steering wheel. Scene (inside and outside the car): The photo was taken from the passenger side, slightly turned towards the driver. The interior is luxurious, with black leather seats and wood inlays on the dashboard and steering wheel. The console and gear shifter are visible at the front of the car. The background, seen through the windshield and driver's window, is a bit blurry (shallow depth of field). The image suggests a street in a Middle Eastern city or the Gulf.`
    },
    {
        imageUrl: "https://i.postimg.cc/28V0bZVw/lian-studio-1761661793330.png",
        prompt: `A realistic photo of a young man standing in front of the holy kaaba in Makkah during umrah. He is wearing traditional white ihram clothes, looking humble and spiritual. The background shows the Masjid-ul- Haram with pilgrims around, golden lighting reflecting a peaceful and divine atmosphere. The focus is on the man standing near the kaaba, hands raised in prayers,full of devotion and faith.`
    },
    {
        imageUrl: "https://i.postimg.cc/7PBFmdJ2/lian-studio-1761696503747.png",
        prompt: "A highly detailed black and white portrait of a man (fit the attached image) with a rugged, textured face, wet skin glistening under soft, directional lighting. The image captures half of his face, emphasizing the forehead, eye, nose, and mouth, with water droplets and small bubbles on his skin, creating a sense of moisture and intensity. His eye is sharp and piercing, with a contemplative expression. The background is completely black, enhancing the dramatic contrast and highlighting the contours and textures of his face. The lighting accentuates the natural details of his skin, stubble, and facial features, creating a moody, cinematic atmosphere. The overall composition is close-up, emphasizing raw emotion and the tactile quality of the wet skin."
    },
    {
        imageUrl: "https://i.postimg.cc/1RWkJ2V4/lian-studio-1761696618612.png",
        prompt: "Without changing my face or hairstyle, create an analogue portrait from the year 2025. The background is Tokyo, Japan, with a supercar. I'm in the car seat, posing like a Korean model, with an aerial view of the car's interior, looking forward. I'm wearing an oversized hoodie, black pants with ripped knees, and low-top Nike Air Jordans. My body is visible from inside the car. Body ratio: 3/4 of the image"
    },
    {
        imageUrl: "https://i.postimg.cc/NGN3pS2M/lian-studio-1761696649786.png",
        prompt: "A stylish man with a muscular build leans against a concrete wall in an urban, industrial setting(use reference photo). He is wearing a sharp white suit with a matching blazer and trousers, paired with a deep maroon dress shirt underneath. The shirt is unbuttoned at the top, adding a bold and confident vibe. He wears aviator-style sunglasses with patterned arms and a luxury wristwatch on his left wrist. His right hand rests casually in his pocket, while his left arm leans on the wall,"
    },
    {
        imageUrl: "https://i.postimg.cc/J7TfPvHh/lian-studio-1761696673807.png",
        prompt: "Place me sitting at a super elegant table. I am wearing an all-black suit black shirt with a silver watch visible on my wrist.\nThe atmosphere should be refined and luxurious, with a sophisticated setting - a modern fine-dining restaurant or a high-end lounge, with soft ambient lighting, crystal glasses, and polished details on the table. Keep my exact facial features from the reference photo, blending naturally with the scene. Hyper-realistic, cinematic, stylish, and classy mood."
    },
    {
        imageUrl: "https://i.postimg.cc/DfC9BH40/lian-studio-1761696705662.png",
        prompt: "A nighttime flash photograph with a raw Y2K aesthetic, featuring the user at a public payphone. He is turning his head back toward the camera with a detached, almost indifferent expression. He is wearing a baggy T-shirt and loose cargo jeans, one hand holding the phone receiver.\nTake only the exact facial features from the user's reference photo — preserve all face proportions, skin tone, and hair style exactly. Do NOT copy clothing from the reference, use the clothing/style described in the prompt. Ultra-consistent identity across all generations.\nStrong harsh flash lighting creates deep contrast and blown-out highlights, casting sharp shadows on the pavement. Blurred car lights streak across the urban background, adding motion and chaos. A red digital timestamp is visible in the bottom corner, evoking early 2000s disposable camera photography. Slight grain, chromatic aberration, and soft blur for realism. Hyperdetailed 8k super-resolution, candid paparazzi snapshot vibe, raw and nostalgic Y2K mood."
    },
    {
        imageUrl: "https://i.postimg.cc/1zP79rVk/lian-studio-1761696747869.png",
        prompt: "A hyper-realistic ultra-close-up portrait of the user underwater, face partially lit with moving caustic light patterns casting across his skin. Tiny air bubbles float around, water surface reflections shimmer softly. Expression is intense and serious, with cinematic focus on the eyes.\nTake only the exact facial features from the user's reference photo — preserve all face proportions, skin tone, and hair style exactly. Do NOT copy clothing from the reference, use the clothing/style described in the prompt. Ultra-consistent identity across all generations.\nMoody teal-green color grading, dramatic contrast, hyperdetailed skin texture with wet highlights, visible water particles, shallow depth of field (f/1.4), 8k super-resolution, cinematic composition, IMG_9999.CR2, shot on Leica SL2, editorial underwater photography style."
    },
    {
        imageUrl: "https://i.postimg.cc/nLZSHG92/lian-studio-1761697111968.png",
        prompt: "Use my uploaded photo as a reference with full sharpness and exact facial features. A man sits on a street column with a confident expression, 3/4 body relaxed.\nAppearance: moss green bomber jacket, tight black t-shirt, dark skinny jeans, and clean white sneakers. Dark sunglasses add a touch of charisma.\nScene: Avenida de Roma, with passing cars, tall buildings, and the Colosseum in the distant background.\nTechnical data sheet:\nStyle: Cosmopolitan street\nResolution: hyper-realistic portrait\nLighting: natural cloudy light, with rays breaking through clouds + urban reflections\nFrame: 3/4 body sitting\nLens: 35mm f/2.0\nColors: moss green, black, white, yellow."
    },
    {
        imageUrl: "https://i.postimg.cc/jSyk0F24/lian-studio-1761697169983.png",
        prompt: "The cinematic golden watch image of the same person from the Jinal selfie, sitting in the open window of a luxury car (G-Class or Brabus), and the left arm rests on the edge of the door.\nThe subject wears black sunglasses and a dark shirt or shirt. Warm sunlight floods the car, casting orange flares and soft shades on the face. Slightly confused hair due to the breeze. The expression is comfortable and confident. Shallow depth of field, lens glare, and rich sunset tones. High-resolution editorial esthetic, photographed with low ISO and main lens. A mood glow that can be Instagram."
    },
    {
        imageUrl: "https://i.postimg.cc/528kdRyq/lian-studio-1761697213759.png",
        prompt: "A sudden flash of an iPhone pierces the deep blackness, revealing his cool, half-buried sand as he relaxes with his bare feet. His soft, linen button-down shirt flutters slightly, not unlike a welcoming sea breeze, styled seamlessly with tailored shorts that exude sophistication. The faint moonlight glistens, and the clean shoreline highlights the faint sheen of his sun-kissed locks, accentuating them more precisely. A photo that enhances his calm and poise, taken on an iPhone, without altering the person's features.\nMake it stand."
    },
    {
        imageUrl: "https://i.postimg.cc/0y7HRBjD/lian-studio-1761697240923.png",
        prompt: "A sudden flash of an iPhone pierces the deep blackness, revealing his cool, half-buried sand as he relaxes with his bare feet. His soft, linen button-down shirt flutters slightly, not unlike a welcoming sea breeze, styled seamlessly with tailored shorts that exude sophistication. The faint moonlight glistens, and the clean shoreline highlights the faint sheen of his sun-kissed locks, accentuating them more precisely. A photo that enhances his calm and poise, taken on an iPhone, without altering the person's features.\nMake him hold the sand in his hands."
    },
    {
        imageUrl: "https://i.postimg.cc/SNBtPhSQ/lian-studio-1761697271253.png",
        prompt: "High-resolution 8K cinematic image of the man in the uploaded image, sitting on a wooden chair with his arms crossed on the chair's back. He's wearing an oversized white T-shirt, black pants, an Apple Watch, and stylish sunglasses. A strong spotlight filters through the Venetian blinds, casting dramatic shadows on his face, body, and the background wall. The composition is simple, with a dark, neutral background and geometric lighting patterns. His expression is both confident and calm, giving the image an elegant cinematic feel\nImportant: The face and hairstyle must\nmatch exactly the reference image provided. Maintain the same texture and length of the hairstyle, and the same facial proportions. The lighting should mimic the effect of the striped shadow cast by the blinds on his face and body. The person should remain seated on the wooden chair with their arms crossed, not standing"
    },
    {
        imageUrl: "https://i.postimg.cc/CL362gFc/lian-studio-1761697331816.png",
        prompt: "The cinematic golden watch image of the same person from the Jinal selfie, sitting in the open window of a luxury car (G-Class or Brabus), and the left arm rests on the edge of the door.\n743The subject wears black sunglasses and a dark shirt or shirt. Warm sunlight floods the car, casting orange flares and soft shades on the face. Slightly confused hair due to the breeze. The expression is comfortable and confident. Shallow depth of field, lens glare, and rich sunset tones. High-resolution editorial 663esthetic, photographed with low ISO and main lens. A mood glow that can be Instagram."
    },
    {
        imageUrl: "https://i.postimg.cc/J4fdFL1Y/lian-studio-1761697356693.png",
        prompt: "A hyper-realistic cinematic close-up portrait of the user standing in heavy rain at night, face slightly turned to the side, wearing black rectangular glasses and a dark denim jacket. Water droplets run down his face and glasses, wet hair clinging to his forehead.\nTake only the exact facial features from the user's reference photo — preserve all face proportions, skin tone, and hair style exactly. Do NOT copy clothing from the reference, use the clothing/style described in the prompt. Ultra-consistent identity across all generations.\nMoody golden backlight creating a soft halo around his wet hair, strong cinematic contrast, shallow depth of field (f/1.4), visible rain streaks in foreground, dramatic film grain, desaturated cinematic tones, IMG_9940.CR2, shot on Leica M11, hyperdetailed 8k super-resolution, intimate emotional mood, film still aesthetic."
    },
    {
        imageUrl: "https://i.postimg.cc/9F6NkhWN/lian-studio-1761697633629.png",
        prompt: "A gritty cinematic black-and-white mid-shot of the user standing shirtless in an underground fight club, sweat glistening on his skin under harsh industrial overhead lights. Medium-dark skin tone rendered in deep monochrome contrast, sharp well-groomed beard, slicked-back slightly messy hair. His fists are wrapped in white fight tape, one arm casually resting on a chain-link fence, the other gripping a water bottle loosely.\nTake only the exact facial features from the user's reference photo — preserve all face proportions, skin tone, and hair style exactly. Ultra-consistent identity across all generations.\nThe background shows a blurred, shadowy crowd behind the fence, smoke and haze filling the air for a raw, tense atmosphere. Lighting is dramatic and directional, casting harsh shadows across the chest and face, highlighting muscle definition. Cinematic framing, deep blacks and clean highlights, fine 35mm film grain, Leica SL2 medium format look, hyperdetailed 8k super-resolution, moody noir-style grading,"
    },
    {
        imageUrl: "https://i.postimg.cc/RFSYTLMC/lian-studio-1761697655799.png",
        prompt: "Full body portrait of a man standing confidently, wearing a turquoise/blue hoodie, black pants, and white sneakers with red and orange accents. Hands in pockets, neutral expression, glasses. Artistic studio photography with a clean teal background. Behind him, dynamic colorful paint splash effect in orange and teal, high contrast, glowing splatter energy, modern digital art style, cinematic lighting, sharp details, Ultra realistic, 8k, dramatic lighting, professional studio photo."
    },
    {
        imageUrl: "https://i.postimg.cc/v8ppJ9Xd/lian-studio-1761697679313.png",
        prompt: "A retro 1980s-style portrait of a man wearing a colorful vintage windbreaker jacket with geometric patterns. He is confidently holding a large silver boombox on his shoulder, standing against a soft studio background. The photo has a nostalgic vibe with bold colors, slightly faded tones, a realistic washed-out look of an authentic 1980s photograph, and subtle film grain for extra realism. Lighting: a soft glow inspired by the past with light haze/fog. Style: an editorial look with strong 1980s character. Use the reference face (take 100% of the facial features and hairstyle from the uploaded image)."
    },
    {
        imageUrl: "https://i.postimg.cc/jqGGpNvb/lian-studio-1761697724762.png",
        prompt: "A surreal aerial view of a man lying on a sandy beach with a white pillow under his head, arms resting behind his head in a relaxed pose, as ocean waves crash dramatically over his body. The perspective is top-down, cinematic, and highly detailed, with clear contrast between the brown sand, foamy white surf, and turquoise water. Ultra-realistic photography style, high definition, vibrant colors, natural lighting."
    },
    {
        imageUrl: "https://i.postimg.cc/nV66y72G/lian-studio-1761697779631.png",
        prompt: "A hyper-realistic cinematic black-and-white portrait of the user standing in an open field, shot from an extreme low angle looking slightly upward, creating a dramatic towering silhouette. He is wearing a long dark overcoat with both hands in his pockets, standing perfectly still with an intense, stoic expression.\nTake only the exact facial features from the user's reference photo — preserve all face proportions, skin tone, and hairstyle exactly. Ultra-consistent identity across all generations.\nHundreds of pigeons are frozen mid-flight around him, with some close to the camera wings blurred for depth and motion, others far away forming a scattered pattern across the cloudy, overcast sky. The foreground birds should frame the subject naturally, creating a sense of movement and chaos around his stillness.\nLighting is soft but contrasty, with deep shadows and clean highlights — think fine art black-and-white photography. Subtle fine 35mm"
    },
    {
        imageUrl: "https://i.postimg.cc/mZcvpVYQ/lian-studio-1761697884833.png",
        prompt: "Without changing my face or hairstyle, create an analogue portrait from the year 2025. The background is Tokyo, Japan, with a supercar. I'm in the car seat, posing like a Korean model, with an aerial view of the car's interior, looking forward. I'm wearing an oversized hoodie, black pants with ripped knees, and low-top Nike Air Jordans. My body is visible from inside the car. Body ratio: 3/4 of the image"
    },
    {
        imageUrl: "https://i.postimg.cc/wxtC4FXt/lian-studio-1761697940670.png",
        prompt: "A stylish man with a dark beard and sunglasses, wearing a black turtleneck sweater, grey cargo pants, and black boots. He is crouching down next to a majestic black horse. Both are in a snowy mountain landscape under a clear sky. Snowflakes are gently falling around them. The man is holding the horse's lead. The overall mood is cool, serene, and adventurous.\""
    },
    {
        imageUrl: "https://i.postimg.cc/fknj8Mcn/lian-studio-1761698009165.png",
        prompt: "A young Indonesian man, based on the attached photo (keep his exact face and hairstyle without any changes, do not crop or alter the face), wearing a thick white jacket with fine details, a red scarf, and casual jogger pants. An extreme low-angle view from below shows him stepping forward confidently. The main focus is on the bottom of his shoes, which feature bright white and red soles with intricate straps and buckles. He looks down toward the camera with a faint, relaxed smile and warm black eyes.\nThe background shows a clear blue sky, dotted with soft white clouds and construction cranes, making the subject stand out. The lighting is natural, bright, and clean during the day, emphasizing the contrast between his outfit and the vivid sky."
    },
    {
        imageUrl: "https://i.postimg.cc/NLq7dQ1P/lian-studio-1761698033029.png",
        prompt: "A cinematic shot capturing the essence of the Middle East, a man shrouded in a richly textured golden fabric with intricate Arabic calligraphy patterns. He stands amidst a desert landscape at sunset, with golden dust and light particles shimmering around him, creating a mystical and awe-inspiring atmosphere. The focus is on his intense gaze, emphasizing strength and dignity. The scene evokes a sense of ancient wisdom and modern luxury, blending tradition with a contemporary aesthetic.\""
    },
    {
        imageUrl: "https://i.postimg.cc/F15gThjy/lian-studio-1761698080942.png",
        prompt: "A cinematic, highly realistic outdoor portrait.\nThe subject is a person (whose specific facial features will be provided by an external image reference). This person is depicted wearing a plain black t-shirt and dark sunglasses. A traditional black and white **Keffiyeh** scarf is draped casually over their left shoulder (from the viewer's perspective), and they are holding the edge of the Keffiyeh with their right hand in a relaxed, confident pose.\n**Composition and Pose:**\n* The person is standing with their body slightly angled to the side, but their head turned towards the camera, making direct eye contact.\n* This should be a **medium shot to a three-quarter shot**, showing the person from the waist up or knees up, framed similar to a professional editorial photograph.\n**Background:**\n* The **Dome of the Rock (Qubbat Al-Sakhra)** in Jerusalem is prominently visible directly behind the subject, slightly out of focus (bokeh effect) to create depth and emphasize the foreground. Its iconic golden dome and th"
    },
    {
        imageUrl: "https://i.postimg.cc/fknj8Mxx/lian-studio-1761698271054.png",
        prompt: "A medium shot of a man in uploaded picture (use the same face and facial), sitting on a wooden crate in what appears to be an industrial or rustic setting with brick walls and metal structures in the background, out of focus.\nThe brick wall painted an Graffiti-style with legend of Real Madrid \"modric\" and text with black and white and purple colours font \"Hala Madrid\"\nHe is looking directly at the camera with a serious or confident expression.\nHe is wearing a white Real Madrid UEFA Champions League full-patch 2025 jersey, black jeans, and light white, - nike sneakers."
    },
    {
        imageUrl: "https://i.postimg.cc/wMsQ51sM/lian-studio-1761698330814.png",
        prompt: "Ultra-realistic cinematic portrait of a young Middle Eastern man sitting confidently on a wicker sofa in the desert at sunset. He is wearing a traditional black outfit with golden embroidery, smoking shisha with smoke rising naturally. A luxury black SUV is parked behind him in the sand dunes. The atmosphere is powerful, dramatic, and cinematic, with warm orange and red sunset tones in the sky. Highly detailed, sharp focus, 8k resolution, photorealistic."
    },
    {
        imageUrl: "https://i.postimg.cc/sxZ4PMZX/lian-studio-1761698355917.png",
        prompt: "Studio portrait of a sophisticated man seated in a dark brown leather armchair, exuding confidence and authority. He is wearing a tailored navy-blue suit, crisp white shirt, textured dark tie, and a folded pocket square. His posture is elegant with crossed legs and hands resting on the chair’s arms. The setting conveys luxury and refinement, with soft, directional lighting highlighting the facial structure and suit details.\nTechnical Details:\n• Lighting: soft key light from a large softbox at 45° to the subject’s face, with gentle fill on the opposite side to maintain contrast. Subtle rim light behind to separate subject from background.\n• Background: upscale interior, softly blurred (bokeh), with classic décor elements such as a la"
    },
    {
        imageUrl: "https://i.postimg.cc/B6zC1Tbw/lian-studio-1761698384514.png",
        prompt: "A hyper-realistic cinematic black-and-white portrait of the user standing in an open field, shot from an extreme low angle looking slightly upward, creating a dramatic towering silhouette. He is wearing a long dark overcoat with both hands in his pockets, standing perfectly still with an intense, stoic expression.\n‎Take only the exact facial features from the user's reference photo — preserve all face proportions, skin tone, and hairstyle exactly. Ultra-consistent identity across all generations.\n‎Hundreds of pigeons are frozen mid-flight around him, with some close to the camera wings blurred for depth and motion, others far away forming a scattered pattern across the cloudy, overcast sky. The foreground birds should frame the subject naturally, creating a sense of movement and chaos around his stillness.\n‎Lighting is soft but contrasty, with deep shadows and clean highlights — think fine art black-and-white photography. Subtle fine 35mm film grain, Leica M11 + Summicron lens look, sharp subject focus with slightly softer vignette edges. Hyperdetailed 8k super-resolution, moody and editorial fashion campaign atmosphere, timeless and surreal.\""
    },
    {
        imageUrl: "https://i.postimg.cc/B6zC1Tb7/lian-studio-1761698406775.png",
        prompt: "Ultra-realistic fashion editorial photoshoot of a male model (keep same face & hairstyle as uploaded photo, do not change facial expression).\nOutfit: oversized textured white sweatshirt (slightly structured fabric), futuristic oversized combat jeans in muted neon lemon-green with exaggerated silhouette.\nFootwear: lemon-green Nike sneakers with bold sole details, styled with white ribbed socks.\nPose: model seated on a sleek modern metallic cube, elegant yet relaxed posture, one arm resting casually, gaze slightly off-camera.\nEnvironment: futuristic muted lemon-green gradient studio background with subtle geometric light streaks.\nLighting: cinematic soft glow with subtle rim-light highlighting skin contours and fabric textures, fashion magazine quality.\nStyle: futuristic x editorial, clean minimalism with avant-garde vibe.\nComposition: full-body centered shot with negative space around the model, perfect for magazine cover."
    },
    {
        imageUrl: "https://i.postimg.cc/FRzZRWrn/lian-studio-1761698471589.png",
        prompt: "‏:A hyper- realistic image of a confident,\nStylish young man (face should match\nthe uploaded refcrence imagc)\nsitting on a luxurious dark brown\nlcather chestetrfield sofa in a dimly lit,\nopulrent room.He is drcssed sharply\nin a white suit with a black shirt\nslightly unbuttoned, wearing white\nleather shoes, a wristwatch, and dark\nsunglasses. His pose is relaxed, with\none leg crosscd and one arm casually\nresting on the armrest.the setting\nfeatures a dark, moody background\nwith rich whitc walls, a classic\nchandclietr with warm glowing bulbs\nhanging abave, and a gothic-style\npainting af a hoodred skull figure\nbehind him the atmosphere is\nintense, cinematic, and mysterious,\nwith dramatic lighting emphasizing\nelegance,pawer,and control.\nstyle: hyper-realistic,cinematic\nlighting,rich tones, dark aesthetic\nFace: match exactly with the\nuploaded image\nAspect Ratio: 3:2 or 4:5 vertical\ncamera angle: eye level, symmetrical\nframe\nMood: powerful, elite, mysterious,\nnoir-inspired"
    },
    {
        imageUrl: "https://i.postimg.cc/MTHDTP6L/lian-studio-1761698543200.png",
        prompt: "A hyper-realistic 4K professional photo of the same man from the reference image, preserving his exact facial features, eyes, hairstyle, and skin tone. He is posing proudly with the Ballon d'Or trophy, standing in a glamorous award ceremony setting. The golden trophy is held in his hands or placed on a pedestal beside him, shining under dramatic warm lighting. He is dressed in an elegant suit, styled like a professional football award winner, with cinematic lighting that highlights both his presence and the glowing golden ball. The atmosphere feels prestigious, luxurious, and powerful, captured with ultra-sharp details and a high-end editorial photography style."
    },
    {
        imageUrl: "https://i.postimg.cc/zG51VJ5M/lian-studio-1761749655153.png",
        prompt: "Male model (same facial features and hairstyle as in the attached photo, without changing facial expression).\nOutfit: oversized white sweatshirt, sky blue oversized combat jeans, styled with sky blue neutral or Nike sneakers and white ribbed socks.\nEnvironment: studio with a muted sky blue background.\nLighting: soft cinematic glow highlighting skin and fabric textures.\nStyle: fashion editorial × futuristic touch.\nComposition: model seated elegantly with a relaxed posture."
    },
    {
        imageUrl: "https://i.postimg.cc/MK1S6c22/lian-studio-1761749710968.png",
        prompt: "A confident man in a sharp dark suit and tie, standing against a black background with dramatic spotlighting above his head. He is smiling proudly, holding his jacket over his shoulder with one hand, while the other hand rests casually in his pocket. The mood is powerful, elegant, and professional, highlighting success and charisma."
    },
    {
        imageUrl: "https://i.postimg.cc/gk3Wzw9V/lian-studio-1761749754687.png",
        prompt: "8K cinematic wide shot based on the uploaded reference image, the man stands confidently on a rooftop at golden hour, overlooking a sprawling city skyline. He wears a casual white t-shirt under an open bomber jacket, black jeans, and sunglasses. The warm sunlight flares behind him, creating a dramatic halo effect. The vibe is urban, bold, and cinematic, like a movie poster."
    },
    {
        imageUrl: "https://i.postimg.cc/v8JywrK6/lian-studio-1761749785285.png",
        prompt: "8K cinematic black-and-white portrait based on the uploaded reference image, the man wears a tuxedo with bow tie, seated dramatically in a velvet armchair. Lighting is moody, high-contrast Hollywood chiaroscuro, with one side of the face in deep shadow. The atmosphere is timeless, elegant, and glamorous, evoking classic film star energy."
    },
    {
        imageUrl: "https://i.postimg.cc/662KPjYb/lian-studio-1761749889909.png",
        prompt: "8K cinematic shot based on the uploaded reference image, man standing on the edge of a rooftop with city skyline glowing at night, wearing dark brown leather jacket, black jeans, and combat boots, sunglasses, dramatic spotlight from above, moody cinematic atmosphere, rebellious superstar look."
    },
    {
        imageUrl: "https://i.postimg.cc/br2mR20F/lian-studio-1761750300383.png",
        prompt: "8K ultra-realistic full-body cinematic shot, wildlife photographer sitting at a 30° angle on a rough brown stone in a vast open field. He looks directly at the camera with calm intensity. A majestic lion rests by his side, calm yet powerful. In the background, zebras graze on dry golden grass, while giraffes and a rhino stand further away near the horizon. A single acacia tree rises on one side, completing the open savanna composition. Above, parrots, an eagle, and a crow soar across the wide sky, adding motion and drama. Far in the distance, faint mountain silhouettes fade into the haze. The dry grass sways in the breeze, creating a natural airy, windy atmosphere.\nThe man wears a grey t-shirt, a rugged brown full-sleeve outer layer, and loose brown cargo pants, paired with formal shoes. He holds a Sony DSLR camera firmly with both hands. His windswept hair, highlighted with streaks of grey and golden, moves naturally in the wild breeze.\nThe environment feels adventurous, cinematic, and alive, with warm golden sunlight casting dramatic shadows, textured earthy tones, and a glowing airy atmosphere of a windy, sunny savanna day.\n⚡ Important: 100% face match with the provided reference images, no changes to facial structure or identity."
    },
    {
        imageUrl: "https://i.postimg.cc/HLBvWmkD/lian-studio-1761750332033.png",
        prompt: "realistic paint shop interior, colorful paint cans neatly arranged on shelves, brushes and rollers hanging, soft daylight from window, realistic lighting and textures, same face as uploaded image, cinematic tone"
    },
    {
        imageUrl: "https://i.postimg.cc/Nj8PVmhr/lian-studio-1761750352689.png",
        prompt: "man cleaning paint tools after work, smiling, clothes slightly messy with colors, realistic Egyptian workshop setting, cinematic focus and natural tone."
    },
    {
        imageUrl: "https://i.postimg.cc/8zg0tw0m/lian-studio-1761750389123.png",
        prompt: "man painting a door frame with roller brush, focused expression, paint splashes on clothes, Egyptian style workshop background, cinematic realism, daylight"
    },
    {
        imageUrl: "https://i.postimg.cc/nV55QnYr/lian-studio-1761750414509.png",
        prompt: "young painter working inside a paint shop, wearing white overalls with paint stains, holding a brush and paint bucket, mid-action painting the wall, realistic Egyptian workshop, natural lighting, photo-realistic."
    },
    {
        imageUrl: "https://i.postimg.cc/1XLjxK5X/lian-studio-1761751063212.png",
        prompt: "Create a photograph of a muscular man (uploaded photo for 100.999% facial reference including sunglasses) relaxing on a lounge chair at a sunny beach resort.\nImage Description\nThe man (uploaded photo) is tanned and shirtless, wearing light beige or khaki shorts. He is wearing sunglasses, and has a watch on his left wrist and a delicate thick gold chain around his neck. He is holding a starbucks coffee in his right hand.\nHe's positioned comfortably on a wooden lounge chair covered with a vibrant teal-colored towel. Directly above him is a large white or light-colored umbrella providing shade.\nThe background suggests a luxurious, tropical location. There are palm trees and other lounge setups visible. Beyond the beach, you can see the ocean or bay under a bright sky, with a shoreline and perhaps some distant structures or landmasses in the hazy background. It looks like a bright, hot day."
    },
    {
        imageUrl: "https://i.postimg.cc/50KrgVhn/lian-studio-1761751102182.png",
        prompt: "Ultra-realistic image of a man sitting gracefully on a bamboo hut deck above the Blue Lagoon in Pagudpud, Ilocos Norte. The turquoise water glows beneath her as sunlight reflects gently across the calm surface.Wearing summer vibe outfit with sunglasses, her face as she gazes toward the ocean, her bare feet resting on the bamboo floor. The breeze moves her hair softly while palm trees and limestone cliffs frame the background. The lighting is warm and cinematic, highlighting her glowing skin and the tropical color palette. The overall mood is vibrant, elegant, and dreamy — pure island glamour captured in an ultra-realistic photograph. Make it real face 100% the photo uploaded."
    },
    {
        imageUrl: "https://i.postimg.cc/502G80Rf/lian-studio-1761751131689.png",
        prompt: "Create a photo that features a man (uploaded photo for 100.999% facial reference including sunglasses) sitting outdoors in what looks like a forest or wooded clearing, perhaps at a campsite or a backyard bonfire area.\nVisual Details\nSubject: The man (uploaded photo) has sunglasses and is smiling faintly as he looks off to the side (viewer's left). He's wearing a light gray crewneck sweatshirt that has two thin stripes (red and dark blue/black) running down the outside of each sleeve. He's paired this with dark pants (likely black jeans or chinos) and tan/beige slip-on loafers worn without socks. He has a simple bracelet on his right wrist.\nSetting & Props: He is sitting on a simple wooden bench. A striped, patterned blanket in shades of red, white, and brown is draped over the bench and his lap. In the background, there's a small campfire burning, creating a warm glow and a bit of smoke. To the right of the fire, there's a wicker picnic basket with the initials \"Nestor\" on it, and a bottle of wine or another beverage is visible next to it.\nAtmosphere: The ground is covered in dark wood chips or mulch and fallen leaves. The surrounding area is lush with green foliage and trees, suggesting it might be late summer or early fall. The lighting is soft, possibly indicating dusk or twilight, adding to the peaceful, relaxed, and slightly romantic atmosphere.\nOverall, it gives the impression of a stylish, relaxed evening spent outdoors enjoying a campfire and a casual picnic."
    },
    {
        imageUrl: "https://i.postimg.cc/zfj6LWpH/lian-studio-1761751151383.png",
        prompt: "Create a striking, full-body portrait of a young man (uploaded photo for 100.999% facial reference including sunglasses) posing in a busy, urban setting, most likely London.\nImage Description\nThe Subject and Outfit:\nThe man, who has sunglasses, is standing in the middle of a street. His outfit features a casual yet stylish look:\nA brown suede or faux shearling jacket with a cream-colored fleece collar and lining.\nA plain white t-shirt underneath.\nLight grey distressed jeans.\nGrey or blue-grey lace-up boots.\nHe has his hands tucked into his jacket pockets and is looking off to his right side.\nThe Background and Setting:\nThe scene is dominated by iconic London elements:\nThe most prominent feature is the Elizabeth Tower, popularly known as Big Ben, which looms large and tall directly behind the man. The clock face is visible, and the tower's gothic architecture is clear.\nTo the man's left is a bright red London double-decker bus, partially visible.\nTo his right, there's a blue classic London taxi (a black cab, but painted blue) parked on the street.\nThe overall lighting is bright, suggesting an overcast or slightly hazy day. The man is standing on what appears to be a multi-lane street, with traffic lights and other city infrastructure visible in the distance. The wide-angle and low perspective of the shot make the Big Ben tower appear especially imposing.\nThe image has a strong focus on street style and a travel theme."
    },
    {
        imageUrl: "https://i.postimg.cc/NjRWcZXF/lian-studio-1761751176792.png",
        prompt: "Create an image that shows a man(uploded photo for 100.99% facial reference including sunglasses), dressed in a sharp dark blue suit and tie, seated in a luxurious brown leather armchair. He is looking out of a large window, holding a coffee mug in his right hand.\nThe setting appears to be a high-rise office or apartment with an incredible view of a modern city skyline. A prominent skyscraper with a spire is visible outside the window.\nOpposite the man is a large, wall-mounted screen or television displaying a financial or stock market graph with various statistics and numbers, suggesting a focus on business or investing. Key figures on the screen include:\n$25,008\n172.41%\n6,186\n1.499\nIn the foreground, there's a sleek black coffee table with a brown leather notebook and a couple of gold decorative objects. The overall atmosphere is one of success, sophistication, and contemplation."
    },
    {
        imageUrl: "https://i.postimg.cc/15kLbyfV/lian-studio-1761751273093.png",
        prompt: "Create an image that shows a young man (uploaded photo for 100.99% facial reference including sunglasses) sitting at an outdoor table on what appears to be a rooftop or terrace.\nKey Details\nSubject and Attire: The man has sunglasses. He's dressed in a light blue and white patterned short-sleeve collared shirt that is open low on his chest, revealing gold necklaces. His lower body, visible only briefly, suggests he's wearing light-colored pants or chinos.\nActivity: He is holding a smartphone in his left hand, looking down at the screen, and holding a small white espresso or demitasse cup in his right hand. A small saucer and spoon are also visible on the table.\nSetting: He is seated in a simple, light-colored chair at a round white table. The surrounding furniture includes wooden reclining lounge chairs. The setting is outdoors, possibly a cafe or restaurant terrace.\nBackground: The background is slightly blurred but shows lush green foliage and, in the distance, modern tall buildings, suggesting an urban environment or city skyline.\nOverall, the image conveys a stylish, relaxed, and modern urban lifestyle scene."
    },
    {
        imageUrl: "https://i.postimg.cc/vTDJwBrk/lian-studio-1761751298078.png",
        prompt: "Create an image that captures a man (uploaded photo for 100.999% facial reference including sunglasses) standing on a high-rise balcony, looking out over a stunning coastal city and the deep blue sea.\nDetailed Description\nThe man, who appears to be in his late 20s or 30s, is dressed in a sharp navy blue, double-breasted suit with a crisp white dress shirt unbuttoned at the collar. He is wearing dark sunglasses and a wristwatch, and he holds a glass of what looks like white wine or perhaps rosé in his right hand. His posture is relaxed yet confident, with his legs crossed at the ankles as he leans slightly against the glass railing of the balcony.\nThe setting is spectacular. Below him, there's a sprawling view of a coastal city, most notably featuring a large complex of orange-colored tennis courts, which strongly suggests the location is either Monte-Carlo or nearby, possibly during the Monte-Carlo Masters tournament. Beyond the city and the beachfront, the Mediterranean Sea stretches out in various shades of turquoise and deep sapphire blue. The coastline curves to reveal a marina area with boats and larger ships in the distance. The sky is bright and clear, indicating a sunny day.\nThe image has a luxurious and sophisticated feel, combining a portrait of a stylish individual with a breathtaking landscape."
    },
    {
        imageUrl: "https://i.postimg.cc/RhqkxF71/lian-studio-1761751392720.png",
        prompt: "Dramatic, ultra-realistic close-up in black and white with high-contrast cinematic lighting from the side, highlighting the contours of his face and beard, casting deep shadows. He wears round, reflective sunglasses. He gazes confidently upward into a dark void. The sunglasses reflect a city's towering skyline. The atmosphere is mysterious with a minimalist black background. Details in 4K. Keep the subject's exact facial structure, hair texture, the original photo."
    },
    {
        imageUrl: "https://i.postimg.cc/5yjhW0BB/lian-studio-1761751418887.png",
        prompt: "Edit this image to show a woman positioned in a close-up portrait shot, face tilted slightly upward at approximately 15-20 degrees with her chin gently lifted, creating a confident, aspirational angle. Her head is centered in the frame with her gaze directed straight toward the camera from behind the sunglasses. She has long, flowing raven-black hair with subtle midnight-blue highlights cascading down both sides of her face and over her shoulders, with strands naturally falling across her chest. She's wearing oversized vintage-inspired cat-eye sunglasses with molten amber-to-gold gradient lenses and lustrous golden frames with delicate etched details, positioned perfectly on the bridge of her nose. Her body is angled slightly (about 30 degrees) to create dimension, with shoulders relaxed and one shoulder subtly closer to the camera. She exudes magnetic confidence with a sultry pout featuring rich burnt-sienna matte lipstick with a subtle glossy center, and dramatic smoky eye makeup with bronze and copper tones visible around the sunglasses. She's wearing a luxurious black silk blazer with peak lapels and a daring plunging neckline, layered with a whisper-thin gold chain necklace featuring a small crescent moon pendant resting at her collarbone, and sleek gold huggie earrings. The background is a rich, saturated golden-yellow that transitions to deeper amber tones at the edges. Dramatic directional lighting from above-left creates sculptural shadows along her neck and cheekbones, with warm backlighting creating a subtle halo effect. The composition is a beauty/fashion portrait style with the face taking up roughly 60% of the frame."
    },
    {
        imageUrl: "https://i.postimg.cc/Gt9Wn2Fk/lian-studio-1761751450649.png",
        prompt: "Edit this image of a man into a black and white artistic portrait in a minimalist fashion studio. He is dressed in a tailored dark suit with sharp lines, paired with polished black shoes. He sits on a simple modern chair, leaning slightly forward with his hands clasped, giving an introspective and confident expression. Lighting is clean and controlled, using soft studio light to create sculpted shadows and highlight facial structure, textures, and fabric details. The background is plain, smooth gray to keep the focus on the subject. High contrast black and white grading emphasizes elegance and depth. Vertical 4:5 crop, cinematic editorial style — refined, timeless, and powerful."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Studio portrait of a confident man sitting on a modern beige armchair with wooden legs, leaning slightly forward with his hands together. He wears a dark navy blue dress shirt with the top buttons open, light beige slim-fit pants, and black loafers with tan soles. He has short dark brown hair styled with texture, a trimmed full beard, tanned skin, and an intense confident gaze directed at the camera. The background is minimalist light gray with a smooth gradient, evenly lit with soft natural studio lighting. The mood is cinematic and fashion editorial, with high realism and fine details. Shot with a 50mm lens at f/2.8, vertical framing, full-body composition.\nthe subject from the uploaded image, maintaining the exact real face, hairstyle, skin tone, and body identity unchanged."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Convert this image so that the man is sitting in the center of a high-back armchair in a minimal, monochromatic studio setting. Replace the current background with a seamless wall and floor in a single solid color, either deep teal, slate blue, or forest green. Dress him in a matching jacket and pants in the same color, paired with a simple white T-shirt underneath. Keep his sneakers clean and white with subtle accents matching the outfit. Retain his wristwatch as an accessory. His posture should be upright and composed, with both feet flat on the ground and his hands gently clasped in his lap. The chair should match the overall color scheme to create a seamless monochrome effect. Lighting should be soft, even, and studio-style, with minimal shadows. The final image should be ultra-high-resolution, sleek, modern, and minimalist, in the style of high-fashion portrait photography."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Edit this image to place a woman in the iconic blue-painted streets of Chefchaouen, Morocco. Position her gracefully ascending blue-painted stone steps, hand gently trailing along the textured wall, captured in a dynamic pose looking up and away with natural joy. She maintains her original tourist clothing. Enhance the lighting to golden hour with warm sunlight streaming between buildings, creating dramatic shadows and highlights on the vibrant blue walls (ranging from azure to deep cobalt). The narrow street features wooden doors with ornate brass knockers, cascading bougainvillea in magenta and purple, terracotta pots with green plants, and traditional Moroccan lanterns casting decorative shadows. Add a stray cat sitting on stone steps for authentic atmosphere. Photorealistic style with rich, saturated colors, slight vignette, and shallow depth of field to create dreamy bokeh in the background."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Create a vertical potrait shot in 1080x1920 format using the exact same face features, characterized by stark cinematic lighting and intense contrast. Captured in a slightly low, upward-facing angle that dramatized the subject’s jawline and neck, the composition evokes quite dominance and sculptural elegance. The background is a deep, saturated crimson red, creating a bold visual clash with the model’s luminous skin and dark wardrobe."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "dit this image to create a vintage watercolor collage of an elegant woman, blending nostalgic artistic elements with expressive paint splashes and delicate textures. The portrait should feature soft, flowing watercolor techniques with intentional drips, bleeds, and layered translucent washes that create romantic depth and emotional storytelling. Focus on warm amber and rich sepia tones as the dominant color palette, with accents of dusty rose, cream, honey gold, and faded mauve to evoke a timeless, vintage photograph aesthetic. Incorporate collage elements such as vintage lace patterns, antique floral illustrations, old love letters, pressed flowers, weathered journal pages, or Victorian-era ephemera subtly woven into the composition. The woman should be dressed in classic, romantic attire—perhaps a vintage lace dress, flowing blouse, or period-appropriate accessories like pearl earrings or a delicate necklace—with her features rendered in graceful, impressionistic watercolor strokes"
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Hyper-realistic, ultra-detailed close-up portrait showing only the left half of my face submerged in water, one eye in sharp focus, positioned on the far left of the frame, light rays creating caustic patterns on the skin, suspended water droplets and bubbles adding depth, cinematic lighting with soft shadows and sharp highlights, photorealistic textures including skin pores, wet lips, eyelashes, and subtle subsurface scattering, surreal and dreamlike atmosphere, shallow depth of field, underwater macro perspective. 3:4 aspect ratio"
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Edit this image to show a handsome man standing in sharp focus against a beautifully blurred urban backdrop. He's positioned in the center-lower portion of the frame, gazing directly at the camera with an intense, confident expression. His body is angled slightly to the side while his face turns toward the viewer. He has textured, wavy dark hair styled upward with volume, a well-groomed beard, and strong facial features. He's wearing a sophisticated all-black ensemble: a sleek black overcoat layered over a black collared shirt or turtleneck. The background features bokeh city lights with glowing neon signs and urban architecture creating dreamy circular light halos. Shot in cinematic black and white with dramatic contrast, shallow depth of field (f/1.4-2.0), professional street photography style. The mood is moody, mysterious, and fashion-forward with film noir aesthetics. High-end editorial quality."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "A cinematic urban portrait of me, keeping my real face unchanged. I am sitting casually on outdoor stone steps in front of a building entrance, leaning slightly forward with a confident and contemplative posture. My left elbow rests on my knee, with my hand raised to my temple in a thoughtful gesture, while my right arm hangs more loosely, with my hand extended downward in a relaxed position. My legs are bent naturally, spreading apart for a grounded and strong presence. My gaze is directed toward the camera, steady and intense, with a calm yet powerful expression. I am wearing a black outfit: a fitted turtleneck sweater layered under a black coat with a wide collar and subtle texture. The coat has a tailored yet modern look, with a slightly matte fabric that absorbs the light, creating depth. My trousers are also black, slim-fitted, completing the clean, monochromatic style. No visible accessories, emphasizing minimalism and sophistication.\nThe background shows part of an urban building with glass doors and warm interior lights softly glowing, adding contrast to the darker tones of my outfit. The lighting is warm and diffused, highlighting my face and upper body while creating soft shadows that add cinematic depth. The camera captures me slightly from below (low angle), emphasizing strength and presence, framed from the knees up. The focal length resembles a portrait lens around 50-85mm, producing natural proportions with a shallow depth of field that keeps me sharp against the softly blurred background. Style: cinematic, moody urban portrait, editorial fashion photography, minimalistic monochrome outfit, professional model vibe."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Recrie essa cena usando minha foto enviada como referência, mantendo o mesmo enquadramento, pose, iluminação e estilo da imagem de exemplo.\n\nA composição deve mostrar um retrato feminino de meio corpo, com a modelo sentada e levemente inclinada para a frente. O braço direito deve cruzar o corpo, com a mão esquerda apoiada suavemente no braço oposto, transmitindo elegância e confiança.\n\nA expressão facial deve ser serena, confiante e levemente enigmática. O olhar deve estar direcionado à câmera, com os lábios suavemente fechados e postura firme.\n\nA roupa é composta por um conjunto escuro e sofisticado — blazer preto estruturado, usado sobre uma blusa preta justa. O cabelo deve estar solto, liso e bem alinhado, caindo sobre um dos ombros de forma natural.\n\nA iluminação deve ser de estúdio, com luz direcional suave e contrastada (estilo Rembrandt ou luz lateral), destacando o contorno do rosto, criando sombras elegantes e um degradê sutil no fundo.\n\nO fundo deve ser liso e neutro, em tons de cinza escuro, com profundidade leve e sem elementos de distração.\n\nO estilo final deve ser preto e branco, com contraste refinado, textura suave da pele e aparência realista de retrato editorial.\n\nFormato vertical (1080x1920), proporção retrato, qualidade fotográfica de estúdio profissional, acabamento cinematográfico e realista."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Turn the photo into a 3x3 grid of photo strips with different studio-style poses and expressions."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "edit this image to design a bold, modern art poster of a man immersed in his music — wearing a cap and wireless earbuds, head tilted slightly as he feels the beat.\n\nSurround him with energetic doodles in black, orange, and white — arrows, lightning bolts, sound waves, and abstract motion lines bursting from his head.\n\nGive the background a clean white or bright orange color, emphasizing contrast and rhythm.\n\nInclude bold graffiti-style text like “Bass Mode,” “Sound Rush,” “Feel It.”\n\nHis jacket or hoodie can have metallic textures or glowing lines to match the energy of the composition."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Edit this image into a bold, confident portrait of a young woman sitting elegantly, chin resting lightly on her hand, eyes forward with unwavering composure. Use dynamic lighting to emphasize her features and add depth to the scene. Style her in a fitted ribbed sweater or chic blazer in tones of cream or midnight blue. Keep the background minimal, with smooth gradients and soft shadows that frame her aura of grace and empowerment."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Edit this image of a young man into a high-contrast black and white portrait in a quiet classroom. he leans casually on a wooden school chair, legs crossed, wearing a navy blue sweatshirt, beige chinos, and black-and-white Converse sneakers. calm neutral expression. His left arm rests on the desk, his right hand drops casually to the side. Behind him, an off-white classroom wall with visible wear, pinned papers, photos, and sticky notes in a grid. One page clearly shows the printed word “Silence”, positioned above his head. Sunlight enters sharply from the right, casting a triangular beam of light on the wall and her shadow. The contrast is dramatic, cinematic, and natural, with a warm late-afternoon tone. The overall style feels candid and realistic, similar to a film photograph: slightly grainy, soft vintage texture, natural imperfections."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Maintain the same face and person (use attached photo for accurate face\n\n‎Hyper-realistic cinematic Create an 8k photorealistic image using the attached photo. A close-up portrait of a woman with long, jet-black, slightly wind-swept hair falling across her face. Her striking, light-colored eyes gaze upwards and to the right, catching a sharp, diagonal beam of natural light that illuminates the high points of her cheekbone, nose, and plump, glossy, mauve-toned lips a slightly light weight silk"
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Uma foto realista com todos os traços e linhas idênticos ao da foto com um semblante imponente, em preto em branco, no traje de terno preto e gravata slim."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Create a hyper-realistic portrait of a man (man of the uploaded photo) sitting in the driver's seat of a car, wearing a black shirt, combined with a faded light gray jacket and light gray wide-leg pants. White shoes should be visible, complementing the casual look. Round sunglasses with dark lenses should be positioned on the nose, highlighting a confident and slightly ironic facial expression. Relaxed posture: one arm on the sports steering wheel, the other supporting the head, conveying a relaxed look. The interior of the car should include side windows showing urban scenery (trees, buildings and part of another vehicle), and a black textured seat. Soft natural lighting, simulating daylight coming through the windows, creating a contrast between the warm colors of the clothing and the neutral environment of the car. Vintage style, with desaturated tones and slightly grainy textures, evoking a nostalgic atmosphere. Dominant tones of gray, white and black, with a balance between external light and internal shadows. Slightly elevated perspective, framing that includes the top of the knees to the head, with the steering wheel partially visible on the right."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Edit this image to show a man walking forward on a rain-slicked urban street, positioned in the center-lower third of the frame, captured in a dramatic three-quarter view. He's wearing a sophisticated charcoal gray trench coat over a black turtleneck and dark fitted trousers, with polished black leather boots. His hand is raised near his chest in a contemplative gesture, checking his watch. The left side of his body is dramatically disintegrating into an explosive dispersion effect—swirling smoke tendrils, ornate clockwork gears, shattered fragments, scattered papers, and metallic particles erupting outward in shades of silver, gray, and slate blue. The background features a misty urban canyon with towering buildings fading into a moody overcast sky. Cinematic depth of field with bokeh lights in the distance. Moody blue-gray color grading with high contrast. Photorealistic digital art style with surreal disintegration effects. 8K quality, dramatic lighting from above creating subtle highlights on the coat."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Recrie essa cena utilizando minha foto enviada como base, mantendo o mesmo enquadramento, pose, iluminação e atmosfera da imagem de referência.\n\nA composição deve mostrar uma mulher sentada sobre um banco alto de madeira com estrutura metálica preta, em um estúdio minimalista de fundo neutro em tons de cinza. O enquadramento deve capturar o corpo inteiro, com leve distância que realce a postura e o cenário limpo.\n\nA modelo deve estar com a perna direita dobrada e apoiada no degrau do banco, enquanto a esquerda toca o chão com elegância, calçando sapatos de salto preto com detalhes translúcidos.\n\nO figurino é totalmente preto e elegante: blazer estruturado sobre os ombros, calça de alfaiataria justa e blusa preta por baixo, transmitindo força, estilo e profissionalismo.\n\nO cabelo solto e alinhado deve cair suavemente sobre os ombros, e a expressão facial deve ser confiante, com o olhar direcionado levemente para o lado, transmitindo poder e serenidade.\n\nA iluminação deve ser de estúdio, com luz suave e direcional, criando contraste equilibrado entre sombras e áreas iluminadas, realçando a textura do tecido e o contorno do rosto.\n\nO fundo deve permanecer liso, com um degradê sutil em cinza, sem distrações, mantendo o foco totalmente na modelo.\n\nO estilo geral deve ser editorial corporativo moderno, com acabamento realista, aparência fotográfica profissional e composição elegante digna de revista.\n\nFormato vertical (1080x1920), proporção de retrato, qualidade fotográfica premium, tom sofisticado e iluminação cinematográfica."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Studio photography of a me in a black suit, black turtleneck and round sunglasses with translucent yellow lenses.\nVibrant orange background.\nUnique poses from the front."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "create a 1/7 scale commercialized figure of thecharacter in the illustration, in a realistic styie and environment.Place the figure on a computer desk, using a circular transparent acrylic base without any text.On the computer screen, display the ZBrush modeling process of the figure.Next to the computer screen, place a BANDAI-style toy packaging box printedwith the original artwork."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Turn my portrait into a pen-and-marker notebook doodle on ruled paper, with playful arrows and tiny margin sketches. Keep my face recognizable."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Edit this image to show an innovative professional man in a creative thinking pose with one hand touching his chin thoughtfully, other hand holding a laptop open at waist level, standing in a three-quarter stance with an enthusiastic visionary expression. He's wearing a modern electric blue blazer over a casual white henley shirt for creative professional appeal. The background is pristine white fading to soft mint green gradient. Digital marketing visual elements float around him: social media platform icons (Instagram, LinkedIn, Facebook, TikTok logos) in their signature colors, minimalist megaphone graphics, ascending analytics chart symbols, engagement icons like hearts and comment bubbles, target/bullseye symbols, and at-sign symbols. Colorful metric badges showing growth numbers (+2.5k, +850). Connecting lines and nodes between icons suggest integrated campaigns. Small lightning bolt and star accents in blue and green add creative energy. The left side displays compelling typography: \"WE'RE HIRING\" with \"HIRING\" highlighted in an electric blue box, followed by \"digital marketers\" and \"#creative minds wanted\" in contemporary sans-serif font. Top left features a campaign or strategy icon. The overall aesthetic is innovative, data-driven yet creative, with LinkedIn professional recruitment energy. Photorealistic rendering with vibrant engaging lighting, digital agency style, and modern marketing talent acquisition aesthetic."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Edit this image into a creative double exposure of a man in side profile, his silhouette seamlessly blended with a vibrant city skyline at dusk. The lights of the city illuminate the contours of his face, symbolizing imagination and ambition. Add depth with warm orange and golden reflections, subtle glow effects, and a dreamy atmosphere — as if the city lives inside his thoughts."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Crie uma imagem minha [foto enviada em anexo] um retrato ultra-realista. Eu estou sentado em uma Moto esportiva preta brilhante em uma área ao ar livre contra o fundo de árvores verdes. Eu uso uma camiseta preta solta, jeans escuros soltos com dobras na parte inferior e tênis Nike preto e branco. Os acessórios usados incluem um relógio preto. Minha mão esquerda descansou casualmente em sua coxa, enquanto sua mão direita descansou na moto enquanto segurava um capacete preto brilhante com uma viseira transparente.\nA moto parece detalhada com um motor grande, quadro forte e detalhes cromados brilhantes, acentuando a impressão moderna e poderosa. O fundo mostra árvores altas com luz natural suave, criando uma mistura equilibrada de sombra e luz. A expressão é calma e confiante, olhando diretamente para\na câmera. O estilo geral é cinematográfico e moderno, combinando a sensação de streetwear jovem com a presença de uma motocicleta arrojada. Alta resolução, estilo editorial fotorrealista."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "A cinematic close-up portrait of a stylish individual standing by a large glass window, gazing thoughtfully at their reflection. The person wears a black turtleneck sweater layered under a fitted dark blazer, creating a sleek and elegant look. The lighting is soft and natural, coming from the window, gently illuminating one side of the face while casting subtle shadows on the other, emphasizing depth and texture. The background is softly blurred, highlighting the calm and introspective mood of the scene. The reflection in the glass adds a sense of duality and contemplation. The overall atmosphere is moody, sophisticated, and cinematic, with a color palette dominated by neutral tones and soft daylight."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Recreate this scene using my submitted photo as a reference, maintaining the same framing, pose, lighting, and style as the example image.\n\nThe composition should show a half-length **male** portrait, with the model sitting and leaning slightly forward. The right arm should cross the body, with the left hand resting gently on the opposite arm, conveying elegance and confidence.\n\nThe facial expression should be serene, confident, and slightly enigmatic. The gaze should be directed toward the camera, with lips softly closed and a firm posture.\n\nThe outfit consists of a dark, sophisticated ensemble—a structured **black blazer** worn over a **fitted black shirt (or T-shirt/sweater)**. **The hair should be neatly groomed and styled appropriately for a man (e.g., short, slicked back, or a modern cut and wearing Sunglasses).**\n\nThe lighting should be studio-style, with soft, contrasting directional light (Rembrandt-style or sidelight), highlighting the contours of the face, creating elegant shadows and a subtle gradient in the background.\n\nThe background should be smooth and neutral, in dark gray tones, with slight depth and no distracting elements. \n\nThe final style should be black and white, with refined contrast, smooth skin texture, and a realistic editorial portrait look.\n\nVertical format (1080x1920), portrait aspect ratio, professional studio photo quality, and a cinematic, realistic finish."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "A man with a beard and short dark hair is captured in a striking portrait, illuminated by dramatic dual-colored lighting. His face is split, with one side bathed in a cool blue light and the other in a vibrant pink/red hue, creating a high-contrast and neon-like effect. He gazes directly at the viewer with a thoughtful or pensive expression, his left hand resting on his chin. He is wearing a dark t-shirt and a watch on his left wrist. The background is dark and indistinct, further emphasizing the colorful illumination on his face and upper body.\n\nDO NOT CHANGE THE FACE"
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "A handsome Asian man (identical to the reference photo, maintaining the original facial features) with a relaxed street-style vibe, sitting in a beauty salon chair with both legs casually resting on the table. He is wearing an oversized white Mbelgedez t-shirt, ripped light blue jeans, brown sunglasses, a silver chain necklace, a G-Shock watch on his wrist, and white high-top sneakers. His hair is styled simply in a neutral tone that complements his outfit. He leans back in a confident yet relaxed pose — one hand lightly touching his face, while the other rests on the armrest of the chair.\nStyle: Photorealistic, urban street style aesthetic.\nLighting: Natural indoor lighting with soft shadows and slightly warm tones, enhancing the relaxed atmosphere.\nComposition: Medium shot, subject centered in a salon environment with mirrors, scattered beauty tools, and raw urban details.\nDetails: Realistic fabric textures (with the Mbelgedez logo clearly visible on the t-shirt), fine hair strand detailing, reflective sunglasses, metallic shine on the silver chain, details on the G-Shock watch, worn textures on the sneakers, and subtle skin shine. A confident expression with an effortless mood in a stylish urban setting.\nQuality: High detail, 8K, masterpiece, cinematic photography."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "A hyper-realistic, cinematic low-angle portrait of a young man standing confidently in the middle of a modern city street, surrounded by towering skyscrapers curving inward toward the sky. He wears a casual oversized gray t-shirt with bold lettering text OMER J, camouflage cargo shorts, and carries a backpack. Black headphones rest around his neck, and he holds a water bottle in one hand. The lighting is natural and dramatic, with clear blue skies and scattered clouds above, emphasizing the sense of scale and urban energy. The composition creates a powerful, larger-than-life perspective, making the subject appear heroic and adventurous-with ultra-detailed textures in clothing, skin, and architecture."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Take a picture with a Polaroid camera. The photo should look like a normal photo, without any clear subject or props. The photo should have a slight blur a consistent light source. Such as a flash from a dark room, spread throughout the photo. Do not change the faces. Replace the background behind the two people with a white curtain."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Edit this image to show an elegant woman standing in sharp focus against a beautifully blurred urban backdrop. She's positioned in the center-lower portion of the frame, gazing directly at the camera with a captivating, mysterious expression. Her body is angled slightly to the side while her face turns toward the viewer. She has voluminous, textured dark hair with natural waves flowing down, styled with an effortless glamour. She's wearing a sophisticated all-black ensemble: a luxurious black wool coat or trench coat with a structured silhouette, layered over a black silk blouse or elegant turtleneck. The background features bokeh city lights with glowing neon signs and urban architecture creating dreamy circular light halos. Shot in cinematic black and white with dramatic contrast, shallow depth of field (f/1.4-2.0), professional street photography style. The mood is moody, enigmatic, and high-fashion with film noir aesthetics. High-end editorial quality."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Recrie essa cena usando o meu rosto e corpo como referência da foto enviada. Mantenha a mesma composição, pose e enquadramento da imagem: uma mulher sentada no chão, com as pernas dobradas e braços apoiados nelas. O cenário deve ser minimalista, com fundo neutro em tons de cinza claro. A iluminação deve ser suave e profissional, destacando o rosto e o cabelo com leve brilho. A roupa deve ser um conjunto branco elegante, composto por calça de alfaiataria e blazer, transmitindo sofisticação e serenidade. A expressão facial deve ser natural e confiante, com um toque de suavidade. Estilo de retrato editorial corporativo, luz de estúdio, tons neutros e acabamento realista."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "\"A hyperrealistic cinematic shot inside a dark movie theater with visible blue seats in the background, filled with various video game characters having fun. The main character, a man (from the provided photo), looks embarrassed, wearing a simple black Nintendo t-shirt, holding a large red and white striped popcorn bucket in one hand.\nOn each side of the main character:\n• Left: Mario Bros. holds a red soda cup in one hand, with a mischievous expression.\n• Right: Donkey Kong is laughing heartily, holding his own popcorn bucket. His smile is wide and sensual, with gleaming teeth.\nIn the background, other video game characters are visible in the seats, including Goku from Dragon Ball, Kratos from God of War, Sonic, Link, Zelda, Princess Peach, a Pikachu-like character, and many more, some wearing 3D glasses, others tossing popcorn in the air, creating a chaotic and festive atmosphere.\nThe lighting is cinematic, primarily coming from an invisible screen in front of them, with light reflections on their faces and popcorn buckets. The details are extremely realistic. The overall atmosphere is joyful, original, and slightly exaggerated.\""
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Convert this image so that the elderly man is sitting in the center of a high-back armchair in a minimal, monochromatic studio setting. Replace the current background with a seamless wall and floor in dark gray, symbolizing strength and resilience. Dress him in a matching dark gray suit with a crisp white shirt underneath. The chair should be upholstered in the same dark gray tone, blending seamlessly with the background. Change his hand position so his hands rest firmly on the armrests of the chair, projecting power and control. His posture is upright and commanding. Lighting should be soft but dramatic, adding subtle definition to emphasize authority. The final result should feel strong, dignified, and powerful, in ultra-high-resolution fashion portrait style."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "A cinematic portrait of a man leaning against a neon-lit brick wall in the city at night, wearing a fitted dark leather jacket and jeans. His pose is relaxed but strong, one foot against the wall, arms loosely crossed. Neon signs in red and blue cast dramatic glows across his face, creating a moody, atmospheric palette. Steam rises faintly from the street drain, adding texture and depth to the scene. His eyes catch the light, making direct, confident contact with the camera. The vibe is bold, mysterious, and modern.\"\n\nCamera Settings:\n\nLens: 35mm\n\nAperture: f/2.0\n\nShutter Speed: 1/60s\n\nISO: 800\n\nFocus: subject sharply focused, neon lights bokeh in background\n\nLighting: neon signage glow, moody side illumination\n\nWhite Balance: tungsten\n\n\nNegative:\nno visible text, no cartoon effects, no CGI look, no extreme HDR halos, no blur on the subject, no duplicate artifacts, no watermarks, no cluttered urban trash"
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "A young man (face similar to the photo) is sitting casually on the front door of a tuned GTR R34 with a large rear spoiler, chrome rims, a silver body with blue stripes, and a blue-violet street racing vinyl sticker along the side. The background is a busy office street or many tall buildings at night, with warm cinematic lighting and soft shadows. The overall atmosphere is inspired by the street racing culture of the 2000s. Photorealistic, high detail, 4k resolution, 3:4 photo size, shallow depth of field, cinematic atmosphere"
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "A hyper-realistic cinematic image, uploaded image a picture of the young man, 1m60, 22 old years do not edit . \nHe is standing at the very top of a famous tower in Paris,\nFrom this high vantage point, the entire Paris skyline is visible: the Eiffel Tower in the distance, classic Parisian rooftops, and winding streets below. White tee-shirt, black watch\nGolden daylight shines across the city, with soft atmospheric haze adding depth. \nThe camera angle is wide, slightly low, making the person look majestic and free while embracing the panoramic view. \nMood: liberating, cinematic, awe-inspiring. \nAspect ratio: 16:9, ultra-realistic, cinematic detail."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Create an ultra-realistic 3D selfie in 9:16 vertical aspect ratio from the attached photo of the man (use the provided image for accurate facial features) with a T-800-style robot. The photo should look like a typical iPhone selfie—slightly uneven framing, camera angle of view, slight distortion from the front camera, natural skin texture, daylight in the background, an apocalyptic scene with other T-800-style robots, subtle motion blur from hand movements, and authentic depth of field from the iPhone's front camera. Maintain a high level of realism and detail, but with the casual, unpolished look of a real phone photo rather than a professional DSLR. 9:16 aspect ratio"
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "professional studio portrait of a person, confident and determined expression, head slightly tilted down, wearing a black V-neck t-shirt. Using a low-key photography setup with butterfly lighting (key light from front above), a hair rim light from behind, and a faint background light. The atmosphere is filled with a subtle haze or smoke. Shot on a medium format camera, high contrast, cinematic, sharp focus, soft shadows. The atmosphere has a subtle haze. Hyper-realistic, shot on a 85mm lens, sharp focus on eyes, detailed facial features. --ar 4:5 --style raw"
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Cinematic photorealistic portrait, vertical composition, saturated and vivid colors. A man (use the provided image for accurate facial features) stands outdoors at sunset, waist up, in the right third of the frame, in profile facing left. He holds a giant, bright full moon in both hands, palms supporting its lower part, fingers spread. The moon is large, occupying the upper left quadrant, glowing intensely in a golden orange (#FF9E00 – #FFB84D), with visible craters and texture, radiating strong light. The man wears a light grayish-beige dress shirt. His skin and face are illuminated by a warm, deep orange light from the bright moon. Background: dramatic, saturated twilight sky, deep fiery orange (#FF4500) and intense crimson red (#D9381E) near the horizon, merging upward into a dark purple-violet (#4B2E83). Low: Dark clouds, visible horizon, silhouettes of trees and buildings in pure black (#000000), with some small, bright bokeh lights.\nLighting and style: Cinematic golden hour tones, high saturation, high contrast, dramatic and dreamlike, warm and intense highlights of the moon, deep shadows for silhouette effect, photorealistic rendering, poetic atmosphere."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "A hyper-realistic cinematic portrait of the uploaded man. Use precise ID locking to preserve his precise facial features, hairstyle, skin tone, body proportions, age, and expressions with 100% accuracy. He exudes the personality of a powerful and domineering gangster, sitting confidently on a luxurious velvet sofa, leaning back in a comfortable yet dominant posture. A lion rests on his lap, its body flowing naturally and comfortably above it. The man's head tilted slightly downward, looking at the cat with a calm and serene expression, while dark sunglasses enhance his aura of dominance and elegance. One hand rests casually on the cat back, the other on the sofa's armrest. He wears a dark, elegant outfit: either a finely pinstriped suit or an open-necked silk shirt... an aura of calm and authority, his presence radiating a quiet, non-aggressive power. Style: realistic, cinematic lighting, extreme detail, and a luxurious atmosphere"
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "“Retrato Masculino Elegante ao Pôr do Sol com Carro de Luxo”\n\nPrompt principal (positivos):\n\nRetrato masculino realista, estilo editorial de luxo, mostrando o mesmo homem da referência principal (barba curta bem aparada, cabelo penteado para trás com volume natural, óculos de armação grossa, expressão confiante e madura) encostado em um carro esportivo preto brilhante durante o pôr do sol.\n\nEle veste um terno azul-marinho bem ajustado, camisa branca e gravata bordô. Usa sapatos de couro marrom e relógio elegante no pulso.\n\nA cena se passa em um ambiente urbano sofisticado, próximo a um parapeito de pedra com vista panorâmica e montanhas ao fundo. O pôr do sol ilumina o céu com tons dourados, alaranjados e rosados, refletindo suavemente na lataria do carro.\n\nO enquadramento é em plano médio, mostrando o homem inteiro encostado casualmente no carro, com uma perna cruzada e uma postura confiante. O foco está na harmonia entre o luxo, o bom gosto e a iluminação cinematográfica dourada.\n\nAlta definição, textura realista da pele, tecidos e reflexos do carro. Estilo fotográfico contemporâneo, luz natural dourada, atmosfera elegante e sofisticada.\n\nDetalhes técnicos e estéticos:\n\nCenário: rua ou mirante urbano durante o pôr do sol\n\nPersonagem: mesmo homem da foto original (barba, cabelo, óculos, traços maduros)\n\nRoupa: terno azul-marinho ajustado, camisa branca, gravata bordô, sapatos de couro marrom\n\nAcessórios: relógio elegante, óculos, lenço no bolso do paletó\n\nCarro: esportivo preto de luxo, com acabamento polido\n\nIluminação: dourada e quente, luz natural do entardecer\n\nComposição: corpo inteiro, levemente inclinado, encostado no carro\n\nClima/emoção: confiança, poder, sucesso e sofisticação\n\nEstilo: editorial de moda masculina / publicidade automotiva\n\nParâmetros recomendados (para Nano Banana):\n--style: cinematic_sunset\n--lighting: golden_hour\n--camera: full_body_portrait\n--focus: man_and_car\n--mood: confident_elegant\n--quality: ultra_detail\n--composition: leaning_on_car\n\nPrompt negativo (para evitar ruídos):\n\nblurry, cartoonish, low contrast, overly saturated, smiling widely, messy background, casual clothes, distorted car, poor reflections, unnatural skin tones, exaggerated lighting, low detail"
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Edit this image to transform it into an expressionist charcoal sketch of a stunning woman with piercing blue-green eyes that shimmer like ocean depths. Create the artwork with bold, passionate, and soulful charcoal strokes that dance between control and abandon. She's captured in a dynamic pose—head turned slightly over her bare shoulder, chin subtly lifted, eyes gazing directly at the viewer with penetrating intensity that's both inviting and guarded.\nHer features are delicately powerful—high cheekbones, full lips rendered with sensual charcoal lines, a graceful neck that flows like a swan's. The strokes defining her face are confident yet tender, with areas of intense darkness contrasting against luminous, barely-touched paper that creates her highlighted features. She wears a flowing, off-shoulder draped fabric in deep burgundy and charcoal tones that cascades around her collarbone, the texture suggested through sweeping, gestural strokes that imply silk or fine cotton.\nThe lighting is moody and cinematic: warm golden light from the right side kisses her cheekbone, the bridge of her nose, and the curve of her shoulder, while deep violet-tinged shadows pool in the hollows of her collarbones and along her neck. Subtle touches of sage green and aquamarine are woven into the charcoal medium—most prominently in her captivating eyes, but also as ghost-like accents in her dark, loosely rendered hair that appears to move with invisible wind.\nHer hair is suggested rather than detailed—wild, expressive strokes that create volume and movement, some strands sharply defined while others dissolve into abstract marks. A few loose tendrils frame her face, drawn with delicate precision.\nThe tall vertical composition creates a sense of elegance and timelessness, with intentional breathing room above and below her figure. The background is alive with emotional energy—explosive charcoal marks in the upper right suggesting turmoil or passion, transitioning to soft, meditative tones in the lower left. Include visible texture: paper grain showing through, smudged areas where fingers dragged across wet charcoal, and strategic erasing that creates ethereal highlights.\nThe overall atmosphere is one of haunting beauty—vulnerability wrapped in strength, softness containing fire—a portrait that captures the full spectrum of feminine emotional depth in the tradition of André de Dienes' iconic dramatic portraiture."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Faça um retrato de estúdio profissional, estilo glamouroso, de uma linda mulher morena com cabelo cacheado e castanho escuro, com uma mecha lateral dramática cobrindo parte de um olho. Ela tem um tom de pele quente e maquiagem sofisticada, com olhos esfumados em bronze e lábios nude fosco. Veste uma blusa ou vestido preto ombro a ombro com um delicado acabamento de renda preta. Ela posa elegantemente, segurando a mão direita com unhas pretas longas e afiadas suavemente sob o queixo, com uma expressão contemplativa e sedutora. A iluminação é suave e direcional (clamshell lighting), criando um gradiente sutil de luz e sombra (chiaroscuro) que realça suas feições e a textura do tecido acetinado. Fundo preto sólido. Alta qualidade, ultra detalhe, fotografia de moda."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Prompt principal (positivos):\n\nRetrato masculino em preto e branco, estilo editorial de revista, foco em um homem sentado em um sofá, expressão confiante e introspectiva, olhar direto para a câmera, pose relaxada com a mão apoiando o queixo, camisa social clara com alguns botões abertos, barba bem aparada e cabelo penteado para trás com volume natural, iluminação suave vinda da lateral criando contraste e profundidade, ambiente sofisticado com cortinas e decoração moderna ao fundo, textura realista da pele e do tecido, nitidez alta, qualidade fotográfica profissional, lente 85mm f/1.8, estilo monocromático cinematográfico.\n\nDetalhes técnicos (para controle de qualidade):\n\nEstilo fotográfico: retrato editorial em preto e branco\n\nEnquadramento: close médio (do peito até o topo da cabeça)\n\nIluminação: luz lateral suave com sombras bem definidas\n\nAmbiente: interior elegante, tons neutros e textura de cortina ao fundo\n\nExpressão: neutra, confiante, levemente pensativa\n\nRoupa: camisa de algodão clara, casual, botões abertos no colarinho\n\nCabelo e barba: penteado natural, barba curta e alinhada\n\nTom geral: sofisticado, artístico, masculino\n\nParâmetros opcionais (para ajustes finos no Nano Banana):\n\n--style: cinematic_bw\n--focus: face\n--lighting: soft_side\n--pose: hand_on_chin\n--mood: confident_relaxed\n--camera: 85mm_f1.8\n--quality: ultra_detail\n\n\nPrompt negativo (para evitar problemas):\n\nblurry, cartoonish, oversaturated, smiling, colored image, low contrast, low detail, harsh lighting, distorted proportions, unrealistic texture, cluttered background"
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Please generate a top-angle and close-up black and white portrait of my face, focused on the head facing forward. Use a 35mm lens look, 10.7K 4HD quality. Proud expression. Deep black shadow background - only the face, the upper chest, and the shoulder."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "“Create a bold, dramatic GQ-style editorial portrait with intense, directional lighting that creates striking shadows and highlights, emphasizing strong facial contours and jawline. The subject wears a sharply tailored, fashion-forward business casual outfit, Use a minimalist, high-contrast background with moody, dark gradients or shadows to create a powerful visual impact. The expression should be confident and slightly fierce, with a piercing gaze that commands attention and conveys authority. Incorporate artistic shadow play and high-definition details to evoke a cinematic, magazine cover effect. The overall image should feel modern and edgy, pushing the boundaries of traditional corporate portraits with a polished, avant-garde finish and vibrant but moody color grading. Use this person in the picture, his face and facial structure, hair, beard, etc"
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Imagem super realista, um homem sentado em sua mesa, desenho. Ao fundo vê se uma estudio de tatuagem desfocado com neons  e tons escuros, o homem veste blusa de frio preta, relógio no pulso do tipo smartwatch. A iluminação é dramática e a câmera de altura média ( da mesa para cima). Luzes e texturas são realistas"
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Ultra-realistic vertical photo (9:16). A young Indonesian-Asian man (use uploaded face, 100% identity lock, no alteration) sits on indoor stairs beside a matte concrete wall. A rectangular beam of golden sunlight from a window hits the wall, creating a crisp shadow silhouette inside the bright frame.\nHe wears a black ribbed knit sweater, tapered grey chinos, and chunky white sneakers.\nPose: seated, elbows on thighs, hands loosely clasped, chin slightly lifted, eyes looking toward the light, calm and confident expression.\nLighting: hard warm sunlight from camera-right as key, soft ambient bounce fill, high contrast with long shadows, cinematic golden-hour mood.\nCamera & look: low-mid angle from a few steps below, 50–85mm f/2.2 lens, shallow depth of field, clean optics, realistic skin texture, fine film grain, subtle vignette.\nStyle: minimalist background, no clutter, fashion editorial realism.\nExclude: cartoon, CGI, AI-artifacts, over-smoothing, plastic skin, excessive sharpening, motion blur, warped anatomy, extra fingers, disfigured hands, double shadow, blown highlights, banding, watermark, logo, text, bad perspective, dirty wall, clutter."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Create a realistic and emotional scene showing a man (use the provided image for accurate facial features) and a lion face to face in a moment of connection and respect. The man's eyes are closed, with a serene expression, while the lion gently rests its forehead and muzzle against his, conveying trust and a spiritual bond.\nBoth are standing on ground covered in light snow, with snowflakes gently falling. The man wears a dark coat and hair slightly tousled by the wind, and the lion displays a thick, majestic mane.\nIn the background, a cold, misty natural landscape with blurred mountains and gray tones reinforces the calm and powerful atmosphere.\nThe lighting is soft and diffuse, highlighting the textures of the skin, fur, and coat, creating a cinematic and poetic atmosphere.\nThe composition should convey friendship, courage, and harmony between man and nature.\n\nSuggested settings:\nStyle: Ultra-realistic, cinematic, 8K\nLighting: Soft, diffuse, natural winter light\nCamera: Medium close-up, focus on expressions\nEmotion: Connection, respect, tranquility\nSetting: Falling snow, blurred background with mountains"
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Studio fashion editorial poster of a young woman sitting confidently on a modern designer chair, wearing full monochrome red outfit (oversized hoodie, joggers, sneakers). Background is pure red with slight texture. Oversized bold white typography across the top spells ‘MAKE IT HAPPEN.’ Minimal branding text at the bottom. Sharp, vibrant, high-fashion design aesthetic."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Take a photo taken with a Polaroid camera. The photo should look like an ordinary photograph, without an explicit subject or property. The photo should have a slight blur and a consistent light source, like a flash from a dark room, scattered throughout the photo. Don't change the face. Change the background behind those two people with white curtains. With that boy and me make a cute poses. Make the boy holding a red coca cola can and girl a burger."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Uma jovem glamourosa, com longos cabelos castanhos ondulados, batom vermelho marcante e maquiagem escura nos olhos, posa sensualmente em um estúdio com temática vermelha dramática. Ela está agachada, vestindo um sobretudo de couro preto brilhante, aberto para revelar a parte superior das coxas, e botas pretas de cano alto acima do joelho ou meias. Ela segura o fone de um telefone de disco vintage vermelho no ouvido, olhando atentamente para o lado. Um telefone fixo vintage vermelho combinando está ao lado dela no chão. Todo o fundo e o piso são de um vermelho sólido vibrante. A iluminação dramática cria destaques em seu casaco e no telefone, enfatizando uma atmosfera elegante, misteriosa e nostálgica."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Crie uma imagem realista baseada na foto que estou enviando, substituindo o rosto e aparência do homem pela minha imagem.\n\nCena: homem elegante relaxando em um barco de luxo navegando por um lago calmo cercado por montanhas e casas sofisticadas ao fundo. O sol da tarde ilumina a cena com luz dourada, refletindo na água cristalina.\n\nDetalhes do personagem: use minha foto como base para o rosto, cabelo e aparência geral. O homem está usando um terno bege claro, sem gravata, com a camisa parcialmente aberta, exibindo um visual sofisticado e confiante. Ele usa óculos de sol escuros e um relógio de luxo no pulso.\n\nAmbiente: barco de madeira polida com estofamento claro, navegando em águas azuis com o reflexo do céu e da paisagem. O fundo mostra vilas à beira do lago e vegetação exuberante em um cenário europeu elegante.\n\nEstilo visual: fotografia de alta qualidade, estilo editorial de revista de moda, iluminação natural e tons quentes."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Can you make this A monochrome side-profile shot of me, with light highlighting the edges of his hair and face. The background fades into darkness, creating a soft contrast that emphasizes his silhouette"
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "A beautiful, confident woman wearing a black suit sits elegantly on a luxurious white chair that highlights her slim, graceful figure. Her right hand rests gently beneath her chin, with her chin slightly raised in a pose of self-assurance. Her head tilts subtly to the right, eyes steady and looking forward with confidence. Her facial features glow under high-quality cinematic lighting, enhancing her natural beauty. The background is pure white, featuring a rare art painting and soft, cinematic illumination. Beside the chair stands a unique white table topped with a black coffee cup and a stylish lamp decor, creating a refined and elegant atmosphere."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "A highly detailed and realistic fine art painting of a person with the same exact facial features as the original photo. The painting should be in the style of a classical or photorealistic oil painting, with smooth brushstrokes and a high level of detail, particularly on the face. The subject should have cinematic color grading and bright lighting that highlights their face.The background should be an abstract painting on a canvas, with colors that complement the subject, but it should not be pure white. The lighting should be dramatic and highlight the edges of the person to separate the subject from the background.The subject should be expertly mingled with the background, seamlessly integrating with the scene. The overall image must have the high-quality, non-digital feel of a traditional painting, with no artifacts from a screenshot or digital editing. The final output image must be in a 16:9 landscape ratio with their face matched. face match 100%."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "A black-and-white editorial portrait of a\nstylish man sitting on a minimalist wooden\nblock inside a modern loft apartment. He\nwears a fitted black sweater, tailored dark\ntrousers, and clean white sneakers, exuding\na refined yet relaxed elegance. Natural\nwindow light softly illuminates his face,\ncasting subtle shadows for depth. The\nsetting includes a potted plant, a large\nindustrial window, and minimalist furniture\nin the background. High-fashion magazine\naesthetic, Numéro Homme style, sharp\ndetails, cinematic mood, medium shot,\nprofessional photography."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Convert this image so that the man is sitting in the center of a high-back armchair in a minimal, monochromatic studio setting. Replace the current background with a seamless wall and floor in a single solid color, either deep teal, slate blue, or forest green. Dress him in a matching jacket and pants in the same color, paired with a simple white T-shirt underneath. Keep his sneakers clean and white with subtle accents matching the outfit. Retain his wristwatch as an accessory. His posture should be upright and composed, with both feet flat on the ground and his hands gently clasped in his lap. The chair should match the overall color scheme to create a seamless monochrome effect. Lighting should be soft, even, and studio-style, with minimal shadows. The final image should be ultra-high-resolution, sleek, modern, and minimalist, in the style of high-fashion portrait photography."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Portrait of a confident man sitting on a beige armchair in an elegant living room. He wears a dark navy blue suit with a white dress shirt, no tie. His hair is dark brown, neatly styled back, and he has a short full beard and fair skin. He sits with his right leg crossed over his left, left arm resting on the chair arm, right hand on his leg, looking directly at the camera with a serious and confident expression. The background shows a sophisticated room with soft warm lighting, blurred lamps, curtains, and framed artwork. The lighting is natural and soft, cinematic, emphasizing texture and detail. Vertical framing, 85mm lens, f/2.8, ultra-realistic corporate editorial portrait.\nthe subject from the uploaded image, maintaining the exact real face, hairstyle, skin tone, and body identity unchanged."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Digital photo of a young man (use my photo as a reference) sitting on a steel wire fence, wearing a stylish casual outfit. Streetwear: black oversized t-shirt with a cool design, light blue oversized wide-leg jeans, white chunky sneakers, wearing a black watch. He is holding an iced drink in a plastic cup with a straw. The background features a bright blue sky, bamboo trees and modern buildings. The pose is from a lower angle, casual yet stylish."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "{\"Ultra-realistic 8K cinematic portrait of the young man in the photo \"without any facial modification\" as a Pokémon Trainer, centered and posing confidently, smiling very \"very subtly\" naturally. Surrounding the user are friendly Pokémon: Pikachu, Bulbasaur, Charmander, and Squirtle, interacting in playful and dynamic ways, some leaning towards the user. The background is a vibrant, sunlit training ground, featuring soft shadows, cinematic lighting, and a spectacular sunset sky with warm orange and pink hues. In the sky, Legendary Pokémon soar majestically, illuminated by the golden sunlight, appearing larger and more prominent for an epic effect. Lifelike Pokémon fur, clothing, and textures, HDR lighting, sharp details, natural yet vivid colors, realistic lens flares, wide-angle perspective, shallow depth of field, and subtle motion blur for dynamic energy. Framed composition like a heroic game poster, capturing a joyful atmosphere, Adventurous and epic Pokémon trainer.\",\n\"size\": \"1024x1024\",}"
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Crie uma fotografia realista de um soldado em posição de prontidão, com leve sorriso, em pé ao ar livre. O soldado sou eu, vestindo uniforme militar camuflado em tons de verde, marrom e bege, com colete tático verde-oliva cheio de bolsos e compartimentos. No colete está escrito o nome( SEU NOME). Uso uma boina vinho com distintivo metálico, uma gola de lã verde enrolada no pescoço e luvas marrons. No braço direito há o brasão com a bandeira do Brasil. Estou segurando um rifle preto moderno, calibre 5,56 mm (M16), apoiado na frente do corpo com as duas mãos.\n\nO fundo mostra arbustos verdes e piso cinza de asfalto. Atrás, complemente a cena com um cenário militar épico, incluindo tanques de guerra, carros de exército, caças voando no céu e soldados em formação ao fundo. A iluminação deve ser equilibrada e realista, transmitindo a atmosfera de uma operação militar. A cena deve combinar prontidão e seriedade com cordialidade e humanidade expressa pelo leve sorriso."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Can you convert this man to be seated in a grand, ornate armchair, dark in color. He's dressed in a dark trench coat, a crisp suit, and using distinctive round sunglasses, which add to an enigmatic aura. The postureshould be composed and intentional, with his hands extended to offer a red and a blue pill.\nThe background is dark, almost sterile room, but visually dominated by the cascading green digital code that symbolizes a simulated reality. This code flows down walls or appears as if projected, creating a sense of being within a computer program. The lighting in this scene is dramatic, casting shadows that emphasize the gravity of the choice being made."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Can you convert this man to be seated in a grand, ornate armchair, dark in color. He's dressed in a dark trench coat, a crisp suit, and using distinctive round sunglasses, which add to an enigmatic aura. The postureshould be composed and intentional, with his hands extended to offer a red and a blue pill.\nThe background is dark, almost sterile room, but visually dominated by the cascading green digital code that symbolizes a simulated reality. This code flows down walls or appears as if projected, creating a sense of being within a computer program. The lighting in this scene is dramatic, casting shadows that emphasize the gravity of the choice being made."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Generate avatars of this person with different hairstyles in a 3x3 grid format"
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Generate a portrait the [change the person] from neck to head, and follow strictely the engraving illustration style of the reference. Put a lot more hatch lines on the face The clothes] don't have any details, only the outside lines."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Create a realistic professional portrait of a man sitting at an office desk with a laptop and documents in front of him. The man’s face should be based on the reference photo provided, keeping the same facial structure, hairstyle, and expression.\nHe is wearing a light beige blazer over a light blue shirt, sitting confidently in a modern office environment with natural lighting and a soft background including a plant and a picture frame.\nThe overall vibe should be clean, professional, and elegant, like a business executive headshot.\nHigh resolution, cinematic lighting, realistic textures, detailed depth of field."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Create a vintage 1970s Bollywood-inspired photograph of a stylish man sitting casually on the hood of a random vintage royal-colored classic car (such as deep maroon, royal blue, emerald green, or mustard yellow). He is dressed in a cream pinstriped blazer, cream bell-bottom trousers, and a dark brown shirt with the top buttons open, paired with brown formal shoes, giving a confident mafia-style look. The car has wide whitewall tires, chrome details, and a polished metallic body, reflecting sunlight. In the background, tall green trees and hedges frame the scene. The photograph has the warm, grainy tones of a 1970s film camera, giving it a retro cinematic vibe. Preserve the same face, expressions, and body proportions from the original photo without changing them, and adjust the body styling so it matches naturally with the preserved face."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Crie uma imagem realista com o MEU ROSTO e a MINHA APARÊNCIA exatamente como na foto que enviei — não mude absolutamente nenhuma das minhas características físicas (rosto, traços, formato dos olhos, nariz, boca, pele, cabelo, corpo etc). Apenas replique o estilo e a composição da imagem abaixo com fidelidade.\n\nA pessoa deve estar com os braços erguidos atrás da cabeça, em uma pose confiante e sensual. A iluminação deve vir de uma janela, projetando faixas de luz e sombra no rosto e no corpo, criando um contraste dramático e artístico. A luz deve destacar principalmente os olhos e o brilho natural da pele.\n\nO fundo deve ser simples e neutro, em tom claro, para manter o foco no rosto. O clima geral da imagem precisa ser intimista, elegante e cinematográfico, com um toque de mistério e intensidade no olhar.\n\nA maquiagem deve ser natural e iluminada, com pele glow e lábios com leve brilho. Os cabelos devem estar soltos, com aparência natural e volume suave. A roupa deve ser uma blusa preta com alças, deixando os ombros à mostra.\n\nImportante: mantenha 100% das minhas características reais — não altere o formato do rosto, olhos, nariz, boca, cor da pele, cabelo ou qualquer traço físico meu. Apenas insira minha aparência nessa mesma pose, iluminação e estilo descritos"
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "A cinematic portrait of a man (use the uploaded picture as reference for the face) sitting confidently on a round black beanbag chair against a dark gradient background. He wears a black hoodie with the sleeves slightly pushed up, black cargo pants, and clean white sneakers. A silver wristwatch is visible on his left wrist. His pose is relaxed and strong elbows resting on his knees, hands hanging loosely between his legs. He has a calm, slight smiling facial expression. The lighting is dramatic and directional, illuminating his face, sneakers, and upper body while the background fades into darkness. The atmosphere is modern, minimalist, and powerful, with a studio photography style and high contrast."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Edit this image to show a man standing in a confident, casual-leaning pose with one hand in his pocket and the other holding a coffee cup, captured from a slightly elevated angle. He has textured wavy hair styled back with a well-groomed beard and an easy, approachable smile. He wears a deep forest green quilted bomber jacket over a light grey turtleneck sweater, paired with slim-fit dark navy chinos and white leather sneakers with brown accents. Add modern accessories including wireless earbuds, a minimalist black smartwatch, and a canvas messenger bag slung over one shoulder. His posture is relaxed yet self-assured. Surround him with artistic fashion sketches in various poses and outfit variations using a cohesive color story (olive, navy, cream, charcoal), arranged in a mood board layout with fabric swatches, texture samples, and style inspiration cards. Use a mixed-media fashion illustration style combining photorealistic rendering for the main figure with loose watercolor washes, pencil sketches, and digital collage elements for the surrounding compositions. Include handwritten style notes, color codes, and design annotations scattered throughout. The overall aesthetic should feel like a creative director's vision board blending contemporary street style with refined artistic documentation."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "--preserve_identity=100% --no_stylization --no_feature_blending. Sujeto basado en la imagen de referencia. Rasgos faciales exactos; 	Estilo editorial hiperrealista en 8K, com atmósfera cinematográfica de atardecer; 	Hombre sentado de lado sobre el techo de un Mercedes-AMG G63 negro, pierna doblada y pie apoyado en el capó, cabeza ligeramente girada mirando a cámara con presencia impactante; vestimenta: chaqueta bomber beige con cremallera frontal, pantalones negros de corte moderno, zapatillas CONVERSE x OFF-WHITE Chuck Taylor Vulcanized Hi “Clear”, gafas de sol Ray-Ban Wayfarer, estilo casual, sofisticado, urbano y moderno com toque editorial; 	Zona Urbana, fondo com cielo nublado gris;	Luz cálida difusa del atardecer, faros del coche encendidos iluminando suavemente y criando profundidad dramática; retrato en 8K hiperrealista, lente 24 mm f/1.2, profundidad de campo reducida, fondo suavemente desenfocado, enfoque absoluto en texturas de piel, cabelo, ropa y materiales del automóvil, iluminación natural combinada com faros, tonos cálidos y contraste suave. 	-- ar 9:16 vertical, 8K RAW, lente 35-85mm f/1.2-f/2.8, ISO 100-400, enfoque nítido en rostro/ojos, profundidad de campo reducida, bokeh suave, HDR, iluminación cinematográfica, gradación cálida/natural, grano de película sutil, texturas hiperrealistas de piel, ropa y accesorios, fondo suavemente desenfocado, nitidez editorial, estilo editorial/alta moda.	-- sin CGI, 3D, render, caricatura, anime; sin piel de plástico, borroso, artefactos, distorsiones, poses rígidas; evitar saturación o colores irreales, sobreexposición, reflejos falsos; no alterar rostro, expresión, cuerpo ni identidad; mantener realismo y estilo cinematográfico/editorial."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Uma mulher com cabelos soltos bagunçado, com uma tonalidade marrom escura. Seu cabelo é brilhantemente iluminado por trás, criando um halo dourado luminoso que contrasta nitidamente com o fundo escuro.\nExpressão e pose: Ela vira o rosto para a câmera, com o olhar diretamente, mas parcialmente coberto por sombras. Sua boca está ligeiramente entreaberta, o que adiciona um ar expressivo e íntimo à foto. Sem mudar a fisionomia"
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Please create a vertical portrait in 1080x1920 format, preserving the subject’s exact facial features. The image should feature stark, cinematic lighting with high contrast. Capture the subject from a slightly low, upward-facing angle to emphasize the jawline and neck, evoking a sense of quiet dominance and sculptural elegance. Use a rich, soft blue background that complements the subject’s eye color, creating a striking contrast with luminous skin tones and a dark wardrobe."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Overhead shot of a 2-month-old baby, wide awake and yawning with arms stretched up, lying on a crisp white surface. The baby is wearing a blue and white striped long-sleeve onesie. Alongside the baby, arranged for a milestone photo: a wooden measuring stick showing '58cm', a fluffy blue number '2' indicating '2month old', and text 'May 26 2016'. Also present are a small brown bottle labeled 'baby oil', a miniature 1kg dumbbell, and a neatly folded blue and white striped baby shirt with a white collar, alongside text '5140g'."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Overhead shot of a 2-month-old baby, wide awake and yawning with arms stretched up, lying on a crisp white surface. The baby is wearing a blue and white striped long-sleeve onesie. Alongside the baby, arranged for a milestone photo: a wooden measuring stick showing '58cm', a fluffy blue number '2' indicating '2month old', and text 'May 26 2016'. Also present are a small brown bottle labeled 'baby oil', a miniature 1kg dumbbell, and a neatly folded blue and white striped baby shirt with a white collar, alongside text '5140g'."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Crie uma imagem hiper-realista baseada na minha imagem de referência (Imagem 1), preservando meus traços e aparência originais, mas recriando fielmente o estilo, roupa, pose, iluminação e cenário da imagem modelo.\nO personagem (baseado na minha foto) aparece em plano médio, voltado levemente para a direita, com o rosto inclinado e olhar firme em direção à câmera.\n\nA expressão é confiante e neutra, transmitindo presença e estilo.\nEle veste uma jaqueta de couro turquesa, moderna e ajustada, com textura realista e brilho suave típico do couro tratado.\n\nO zíper e os botões metálicos devem refletir a luz com realismo e sutileza, mantendo o aspecto de fotografia de moda profissional.\n\nNos olhos, óculos escuros espelhados azul-petróleo, com reflexos sutis do ambiente — realçando a estética urbana.\nO fundo é monocromático, em tom turquesa idêntico à jaqueta, criando um visual harmonioso e de alto contraste com a pele.\n💡 Iluminação de estúdio profissional:\n\nLuz principal (key light) suave e frontal, vinda levemente da esquerda, com difusor grande (softbox 120 cm).\nLuz secundária de preenchimento (fill light) neutra do lado direito, reduzindo sombras e mantendo textura facial.\nLuz de recorte (rim light) sutil no ombro e cabelo, criando separação do fundo.\nTemperatura de cor balanceada (5500K) — luz branca natural de estúdio.\nSombras limpas e controladas, mantendo foco no rosto e na jaqueta.\n📷 Câmera e Lente:\n\nSony A7R IV, lente 85mm f/1.8, ISO 100, obturador 1/160s, abertura f/2.\n\nFoco absoluto no rosto, fundo suavemente desfocado (bokeh leve).\n🎨 Color grading e estilo visual:\n\nEstilo Modern Editorial Cool Tone:\nPaleta dominada por tons turquesa, azul e pele quente neutra.\nContraste alto e nitidez refinada, mas sem perder naturalidade.\nCores vibrantes e limpas, sem granulação perceptível.\nTextura realista de pele e cabelo, com brilho controlado.\nReflexos metálicos sutis no zíper e nos óculos.\nTom visual: elegante, vibrante e urbano — como capa de revista ou campanha de moda contemporânea.\nFiltro: Cinematic Cool HDR, com cores saturadas e luz de estúdio limpa.\nAmbiente: fundo monocromático turquesa, estúdio moderno, luz balanceada.\nPalavras-chave visuais:\n--ultra realistic --studio lighting --8k --HDR contrast --photo realism --vibrant tones --depth of field --sharp focus --fashion editorial --turquoise tones --clean background --modern portrait --soft shadows --bokeh background --studio quality --skin texture detail --leather jacket\n🎬 Notas do Diretor de Fotografia:\n\nA chave visual é o equilíbrio entre o turquesa saturado e a pele natural, sem que nenhuma cor domine a outra.\n\nA luz suave e frontal garante textura na pele e brilho uniforme na jaqueta.\n\nO enquadramento em plano médio com leve inclinação do rosto transmite carisma e estilo.\n\nO resultado deve parecer uma foto de revista de moda internacional (GQ, Vogue Men, Balmain Campaign) — idêntica em cor, luz e composição à original, mas com você como protagonista."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "A hyper-realistic 8K cinematic up-close\nphoto of a man (use attached photo) performing an avatar bending stance outdoors. A swirling ring of all four elements: earth, air, water, and fire surrounds him, forming a dragon, complete with claws, whiskers, and dramatic twists. The dragon appears to be alive flowing outside his hands, captured with natural physics elements-water, droplets, splashes, refractions, mist, rocks, dust, pebbles, wind, flames,\nembers, 3:4 aspect ratio."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "A young man with dark hair and glasses, wearing a puffy jacket over a mustard yellow sweater, stands in a low-angle medium shot. Dramatic lighting from warm and cool sources highlights\nhis serious expression against a backdrop of angled, linear neon lights. The composition has a shallow depth of field, emphasizing the subject while slightly blurring the vibrant, abstract background."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Stylized studio portrait of me leaning slightly on a large reflective glass panel. Outfit: tailored grey plaid suit, black loafers. Pose: hand in pocket, soft confident smirk. Reflection captures double perspective. Warm rim lighting adds fashion depth.\"\ndon't change the face use 100% face of upload picture."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Studio portrait of a confident man sitting on a modern beige armchair with wooden legs, leaning slightly forward with his hands together. He wears a dark navy blue dress shirt with the top buttons open, light beige slim-fit pants, and black loafers with tan soles. He has short dark brown hair styled with texture, a trimmed full beard, tanned skin, and an intense confident gaze directed at the camera. The background is minimalist light gray with a smooth gradient, evenly lit with soft natural studio lighting. The mood is cinematic and fashion editorial, with high realism and fine details. Shot with a 50mm lens at f/2.8, vertical framing, full-body composition.\nthe subject from the uploaded image, maintaining the exact real face, hairstyle, skin tone, and body identity unchanged."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Extreme close-up macro portrait focusing intensely on the right eye of a young man [reference man on the photo]. The man has bright brown eyes and sun-kissed, dewy skin. Harsh, dramatic sunlight casts deep, textured shadows across his face, specifically from tiny blue wildflowers which are blurred in the foreground. The background is a solid, clear sky blue. High-resolution, cinematic, hyper-detailed photography with high contrast, emphasizing skin texture and the intense gaze."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "This is a photo of me. Craft a moody studio portrait of the uploaded person bathed in a golden-orange spotlight that creates a glowing circular halo behind"
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Ultrarealistic artistic portrait of the model in the reference photo, preserving all real features. [uploaded image], [do not alter the face in the submitted photo], wearing a stylish black sweatshirt, hair glowing with golden backlighting, contrasted by cool green light on the face and chest, against a deep black background. The model is posed slightly in profile, head turned gently to the side with a thoughtful expression, avoiding direct eye contact with the camera."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "A portrait using my face, depicted as a hacker in a dark, rainy urban environment, strongly in the style of Mr. Robot. The subject is wearing a large hooded sweatshirt, covering the entire head but leaving the face visible, looking at the camera, with a computer screen reflecting a soft green code onto their face. The lighting is dramatic and low-contrast, with only the monitor light and some blurred streetlights in the background. There is a sense of isolation and paranoia. The image has a grainy, almost cinematic aesthetic, reminiscent of modern noir films, with a focus on technology and surveillance."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Use a foto que estou enviando como referência principal para o rosto e aparência da pessoa.\n\nRecrie esta cena de retrato corporativo profissional em estúdio, mantendo o mesmo enquadramento, iluminação e expressão da imagem de referência.\n\nCena: retrato de meio corpo em estúdio, com fundo neutro em tom cinza suave e iluminação difusa que destaca a pele e os traços do rosto.\n\nComposição: a pessoa (substitua pelo meu rosto e aparência) está com uma expressão confiante e elegante, levemente inclinada para a direita, uma mão próxima ao pescoço segurando suavemente o colar.\n\nRoupa: blazer marrom claro (caramelo) sobre blusa branca texturizada, com colar prateado visível.\n\nEstilo fotográfico: retrato de estúdio com luz suave, foco nítido no rosto, tons de pele naturais e acabamento profissional.\n\nEstilo geral: editorial corporativo moderno, clean e sofisticado — aparência de “executiva de sucesso” com um toque fashion.\n\nQualidade: ultra realista, alta definição, iluminação de estúdio, fundo limpo, textura detalhada e tons de cor equilibrados."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Create an 8K ultra-realistic portrait of an Indian woman wearing a vibrant all-red, v-shape tie-front crop top,textured midriff-baring outfit with a loose, tied sarong-style bottom. Her brown black wavy hair with high bun. (use same face as uploaded photo) She has long, wind-blown hair and is adorned with intricate stone gold jewelry. She poses with confident introspection, one hand gently resting on her neck, revealing The setting is a bright tropical environment. Focus on textures,warm tones,and fine art photographic quality."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Create a Time Magazine cover-worthy portrait with authoritative pose, professional attire, and sophisticated background setting. Include the iconic red border frame, Time logo, and \"Person of the Year\" typography with appropriate year designation."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "cinematic film still from the John Wick franchise, neo-noir aesthetic, hyper-detailed 8K --ar 16:9\n\nSUBJECT: A hyperrealistic portrait of [subject: use uploaded reference photo for *exact facial features, bone structure, and unique characteristics], exuding an aura of intense focus and dangerous calm. He is posed stoically against his classic American muscle car (a 1969 Ford Mustang). He wears a impeccably sharp, all-black tailored suit and a black shirt. **Crucially, the face and hairstyle must retain 100% fidelity to the provided reference photo, ensuring no deviation in distinct facial markings, eye shape, or overall likeness.*\n\nSCENE: A rain-slicked, dark city alleyway at night, drenched in the glow of vibrant Japanese and Cyrillic neon signs. Puddles on the asphalt reflect the electric blues, deep purples, and crimson reds of the background.\n\nLIGHTING: Dramatic, high-contrast lighting. The car's headlights act as a harsh key light, sculpting the subject's features and creating long, hard shadows. The ambient neon lights cast a saturated, colorful rim light. Prominent anamorphic lens flares streak horizontally from the light sources.\n\nATMOSPHERE & COLOR: Moody, gritty, and atmospheric, with visible mist and fog diffusing the light. The color grade is heavily stylized with deep, crushed blacks, and a saturated palette of electric blue, magenta, and warm amber.\n\nCAMERA: Shot on an anamorphic lens, shallow depth of field, low-angle shot. Subtle, realistic cinematic film grain."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "(Identical to the reference photo, retaining original facial features) A ​​young Asian woman wearing a black baseball cap with \"PRO\" emblazoned on it and a white baseball-style shirt with the number \"0.00\" printed on the front. She adopts a confident S-curve pose with her head slightly tilted, giving a playful wink and a flirtatious smile, while touching her cheek with her right hand in a half-heart pose. Her long brown hair, decorated with a small pink bow, is visible under the cap. She has bright and cute makeup, featuring gray lenses that make her eyes appear larger, pink blush that accentuates her cheeks, and glossy pink lipstick on her full lips. The background is a soft light pink.\n\nStyle: Photorealistic, cinematic photography\nLighting: Natural light, soft, even lighting that highlights the details of the makeup and the model's facial expressions, with a sharp focus on the model's face and clothing.\n\nComposition: Medium shot, subject centered\nDetails: Realistic fabric texture on baseball cap and shirt, fine hair strand detail, subtle shine on glossy pink lipstick, soft texture of pink ribbon, realistic skin texture with visible pink blush, clear contact lens detail.\nQuality: High detail, 8K, masterpiece, cinematic photography."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Ultra-realistic 3D 9:16 vertical format fisheye selfie of me with [Christiano Ronaldo, Messi]. We're all making silly, exaggerated faces. Set in a football stadium, bright conditions, stadium full of viewer, with white tones. low camera angle. Realistic, cinematic lighting integrated with stylized realism."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "A hyper-realistic portrait of the uploaded young man inside a giant Instagram post frame that dominates the scene. His face remains same, sharp and untouched, wearing dark sunglasses and sleek shoes, exuding bold charisma. His relaxed pose shows his right elbow resting on his knee, left arm casual, and one leg stepping out of the Instagram frame in a 3D illusion. The Instagram frame is highly realistic with username GoogleGeminiPrompts, verified checkmark, display name \"Al Generation\", caption: \"Too real to stay inside frame #AlCreation #GoogleGeminiPrompts\", and authentic icons. The background is designed for masculine boldness: deep cobalt blue blending into cyan, with subtle light streaks adding energy, Clean, cinematic lighting highlights his clothing textures and the 3D illusion, making him the viral centerpiece."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "“Look Urbano Casual Sentado”\n\nPrompt principal (positivos):\n\nMulher com o mesmo rosto, cabelo e características físicas da pessoa de referência principal, retratada em uma rua estreita de paralelepípedo com arquitetura antiga e atmosfera urbana europeia.\n\nA mulher está sentada no chão, em pose descontraída e natural, com uma perna dobrada e a outra cruzada levemente sobre ela.\n\nEla veste um suéter grosso de lã na cor laranja mostarda, com textura macia e mangas longas, e uma calça jeans clara levemente ajustada.\n\nNos pés, tênis brancos simples e limpos, estilo casual, reforçando o clima urbano e jovem.\n\nO cabelo está solto, levemente despenteado e natural, com movimento suave pelo vento. O olhar é direto e confiante, com uma leve expressão pensativa e espontânea.\n\nA iluminação é suave e difusa, típica de um fim de tarde nublado, criando um clima cinematográfico e íntimo.\n\nO fundo mostra prédios de pedra e arquitetura clássica, com perspectiva em profundidade que leva o olhar pelo corredor urbano.\n\nO enquadramento é meio corpo até corpo inteiro, com foco nítido no rosto e no look, e leve desfoque de fundo.\n\nEstilo fotográfico editorial de moda urbana, equilibrando naturalidade e sofisticação.\n\nDetalhes técnicos e estéticos:\n\nCenário: rua de paralelepípedo estreita, prédios de pedra, estilo europeu\n\nLuz: natural difusa (fim de tarde ou luz nublada)\n\nPose: sentada no chão, perna cruzada, uma mão próxima ao rosto\n\nRoupa: suéter laranja mostarda + jeans azul claro + tênis branco\n\nCabelo: solto, levemente bagunçado, natural e volumoso\n\nExpressão: leve sorriso, olhar relaxado e confiante\n\nComposição: perspectiva de profundidade, foco no sujeito com fundo levemente desfocado\n\nAtmosfera: casual, autêntica, cinematográfica, natural\n\nParâmetros sugeridos (para Nano Banana):\n--style: cinematic_street_portrait\n--camera: medium_full_body\n--lighting: soft_natural\n--composition: urban_depth\n--mood: relaxed_confident\n--quality: ultra_realistic"
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "A young man with a slight smile (see the uploaded picture as reference for the face), wearing outfit: oversized white sweatshirt, lemon green oversized combat jean, styled with footwear: lemon green neutral Nike sneakers and white ribbed socks. Environment: futuristic lemon green-tone studio background. Lighting: soft cinematic glow highlighting skin and fabric textures. Style: fashion editorial x futuristic. Model seats on lemon green bench elegantly with a relaxed posture."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Ultrarealistic artistic portrait of the model in the reference photo, preserving all real features. [uploaded image], [do not alter the face in the submitted photo], wearing a stylish black sweatshirt, hair glowing with golden backlighting, contrasted by cool green light on the face and chest, against a deep black background. The model is posed slightly in profile, head turned gently to the side with a thoughtful expression, avoiding direct eye contact with the camera."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Crie uma imagem realista usando a foto que estou enviando como base para o rosto e aparência da pessoa.\n\nCena: homem elegante posando com confiança em frente a um jato particular estacionado na pista, em um dia ensolarado. A atmosfera transmite sucesso, sofisticação e poder.\n\nDetalhes do personagem: substitua o rosto e aparência pelo meu da foto enviada. O homem veste um terno preto de corte impecável com botões dourados, camisa branca social sem gravata e lenço branco no bolso do paletó. Ele usa um relógio de luxo metálico no pulso esquerdo e tem expressão firme e determinada.\n\nAmbiente: exterior de aeroporto executivo, com o jato de fundo levemente desfocado, iluminação natural suave e tons realistas.\n\nEstilo visual: fotografia de campanha publicitária de marca de luxo (como Rolex, Hugo Boss ou Breitling). Alta definição, contraste equilibrado, foco nítido no personagem e fundo com leve desfoque."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "A striking outdoor portrait captures a man of South Asian descent, possibly in his 40s or 50s, holding a falcon on his gloved left hand. He wears traditional Arab attire, including a white thobe and a red and white ghutra secured with an agal, suggesting a connection to Gulf Arab culture or a setting within the region. His weathered face is framed by a full, well-groomed grey beard, and his dark eyes look directly at the viewer with a serious, unsmiling expression.\nThe falcon, perched calmly on his hand, is adorned with a hood, indicating it's a trained bird. Its brown and white speckled feathers contrast with the man's white garment and the rich brown leather of the falconry glove.\nIn the background, under a clear blue sky, the iconic Burj Khalifa stands tall and prominent, dominating the skyline of what appears to be Dubai. Other modern buildings and the sprawling urban landscape extend into the distance, reinforcing the setting. The lighting suggests a bright, sunny day, with the sun likely coming from the right, casting subtle shadows and highlighting the textures of the man's clothing and the falcon's feathers. The image is a cultural blend, showcasing tradition against a backdrop of modern architectural marvels.Use the face from the uploaded reference image and preserve the same facial features - do not alter the face. Keep my face same 100% same as in the reference imaes"
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Crie uma imagem minha [foto enviada em anexo com todas as suas características] eu estou usando um boné de beisebol e óculos de sol Ray-Ban. Ele está vestido com uma camiseta branca, calças cargo táticas com detalhes de tiras laterais, uma camisa de flanela de manga comprida preta e branca amarrada na cintura, um relógio esportivo e tênis Converse pretos. Eu estou sentado casualmente no asfalto sob um viaduto da cidade, encostado em um grande pilar de concreto coberto de grafite colorido. Minha perna direita está dobrada, com o tênis Converse posicionado bem próximo à câmera, dominando o primeiro plano para uma perspectiva dramática de olho de peixe de um ângulo muito baixo. Cenário: uma cena noturna realista de uma cidade metrópole, com rastros de luz de carros (listras vermelhas, amarelas e brancas), prédios altos iluminados. Estilo da câmera: lente olho de peixe, ângulo muito baixo, proporção de tela 9:16, iluminação noturna, alto contraste e sombras realistas. O estilo geral é um editorial de moda de rua ultrarrealista, com uma pegada urbana moderna. A qualidade das fotos é ultra HD 8K."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Recrie essa cena utilizando minha foto enviada como base, mantendo o mesmo enquadramento, pose, iluminação e atmosfera da foto de referência. A composição deve mostrar um homem sentado sobre um banco alto de madeira com estrutura metálica preta, em um estúdio minimalista de fundo neutro em tons de cinza. O enquadramento deve capturar o corpo inteiro, com leve distância que realce a postura e o cenário limpo. Um modelo deve estar com a perna direita dobrada e aperfeiçoado no degrau do banco, enquanto a esquerda toca o chão com elegante, calçando sapatos social preto com detalhes translúcidos. estatueta é totalente preta e elegante: no dedinho da mão esquerda um anel com uma pedra de circonia, e no pulso um relogio rolex, blazer estruturado, calça de alfaiataria justa e blusa azul musgo por baixo, transmitindo força, estilo e profissionalismo, e a expressão facial deve ser confiante, com o olhar direcionado levemente para o lado, transmitindo poder e serenidade. A iluminação deve ser de estúdio, com luz suave e direcional, criando contraste equilibrado entre sombras e áreas iluminadas, realçando a textura do tecido e o contorno do rosto. O fundo deve permanecer liso, com um degradê sutil em cinza, sem distrações, mantendo o foco totalmente no modelo. O estilo geral deve ser editorial corporativo moderno, com acabamento realista, aparência fotográfica profissional e composição elegante digna de revista. Formato vertical (1080x1920), proporção de retrato, qualidade fotográfica premium, tom sofisticado e iluminação cinematográfica."
    },
];

const FeatureCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    language: Language;
  }> = ({ icon, title, description, language }) => (
    <div className={`flex items-start p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm gap-3 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
        <div className="flex-shrink-0 w-12 h-12">{icon}</div>
        <div>
            <h4 className="text-lg font-bold text-brand-primary dark:text-white">{title}</h4>
            <p className="text-sm text-brand-primary dark:text-gray-400">{description}</p>
        </div>
    </div>
);


export const LandingPage: React.FC<LandingPageProps> = ({ setView, t, language, visibleCards, setVisibleCards }) => {
  const [activeContentType, setActiveContentType] = useState<ContentType>('studio');
  const [activeInfoTab, setActiveInfoTab] = useState<InfoTab>('about');
  
  const contentTypes: ContentType[] = ['studio', 'images', 'videos', 'audio', 'text'];
  const infoTabs: InfoTab[] = ['about', 'why', 'mission', 'features'];
  
  const contentTypeIcons: Record<ContentType, React.ReactNode> = {
    studio: <StudioIcon />,
    images: <PhotoIcon />,
    videos: <VideoIcon />,
    audio: <AudioIcon />,
    text: <TextIcon />,
  };
  
  const infoTabIcons: Record<InfoTab, React.ReactNode> = {
    about: <InformationCircleIcon />,
    why: <CheckBadgeIcon />,
    mission: <FlagIcon />,
    features: <Squares2X2Icon />,
  };

  const Card: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    buttonText: string;
    onClick: () => void;
    isBeta?: boolean;
  }> = ({ icon, title, description, buttonText, onClick, isBeta }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300">
      <div className="mb-4">{icon}</div>
      <div className="flex items-center justify-center gap-2 mb-2">
        <h3 className="text-2xl font-bold text-brand-primary dark:text-white">{title}</h3>
        {isBeta && (
          <ShimmerWrapper className="rounded-full">
            <span className="inline-flex items-center justify-center bg-brand-accent text-brand-bg text-xs font-semibold px-2.5 py-1 rounded-full min-w-[50px]">
              {t('beta_tag')}
            </span>
          </ShimmerWrapper>
        )}
      </div>
      <p className="text-brand-primary dark:text-gray-400 mb-6 flex-grow">{description}</p>
      <ActionButton
        onClick={onClick}
        className="w-full bg-brand-accent text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-accent-dark transition duration-300 transform hover:-translate-y-1 hover:shadow-2xl"
      >
        {buttonText}
      </ActionButton>
    </div>
  );
  
  const InfoSection: React.FC<{title: string; children: React.ReactNode}> = ({ title, children }) => (
    <section className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-brand-primary dark:text-white mb-4">{title}</h2>
        <div className="text-lg text-center text-gray-600 dark:text-gray-300 space-y-4">
            {children}
        </div>
    </section>
  );

  const renderInfoContent = () => {
    switch(activeInfoTab) {
        case 'about':
            return (
                <InfoSection title={t('landing_about_title')}>
                    <p>{t('landing_about_desc')}</p>
                </InfoSection>
            );
        case 'why':
            return (
                <InfoSection title={t('landing_importance_title')}>
                    <p>{t('landing_importance_desc')}</p>
                </InfoSection>
            );
        case 'mission':
            return (
                <InfoSection title={t('landing_goals_title')}>
                    <p>{t('landing_goals_desc')}</p>
                </InfoSection>
            );
        case 'features':
            return (
                <section className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-brand-primary dark:text-white mb-8">{t('landing_features_title')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <FeatureCard language={language} title={t('landing_feature_1_title')} description={t('landing_feature_1_desc')} icon={<SparklesIcon />} />
                        <FeatureCard language={language} title={t('landing_feature_5_title')} description={t('landing_feature_5_desc')} icon={<PaintBrushIcon />} />
                        <FeatureCard language={language} title={t('landing_feature_2_title')} description={t('landing_feature_2_desc')} icon={<WandIcon />} />
                        <FeatureCard language={language} title={t('landing_feature_3_title')} description={t('landing_feature_3_desc')} icon={<CombineIcon />} />
                        <FeatureCard language={language} title={t('landing_feature_7_title')} description={t('landing_feature_7_desc')} icon={<RestorerIcon />} />
                        <FeatureCard language={language} title={t('landing_feature_11_title')} description={t('landing_feature_11_desc')} icon={<WriterIcon />} />
                        <FeatureCard language={language} title={t('landing_feature_12_title')} description={t('landing_feature_12_desc')} icon={<TranslatorIcon />} />
                        <FeatureCard language={language} title={t('landing_feature_4_title')} description={t('landing_feature_4_desc')} icon={<DocumentTextIcon />} />
                        <FeatureCard language={language} title={t('landing_feature_6_title')} description={t('landing_feature_6_desc')} icon={<PencilRulerIcon />} />
                        <FeatureCard language={language} title={t('landing_feature_8_title')} description={t('landing_feature_8_desc')} icon={<VideoIcon className="w-12 h-12 text-brand-accent"/>} />
                        <FeatureCard language={language} title={t('landing_feature_9_title')} description={t('landing_feature_9_desc')} icon={<AudioIcon className="w-12 h-12 text-brand-accent"/>} />
                        <FeatureCard language={language} title={t('landing_feature_10_title')} description={t('landing_feature_10_desc')} icon={<TextIcon className="w-12 h-12 text-brand-accent"/>} />
                    </div>
                </section>
            );
        default:
            return null;
    }
  }

  const renderContent = () => {
    switch (activeContentType) {
        case 'studio':
            return (
                <div className="mb-20 md:mb-32">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {studioCardsData.map((card, index) => (
                            <StudioCard
                                key={card.imageUrl + index}
                                isVisible={index < visibleCards}
                                t={t}
                                language={language}
                                imageUrl={card.imageUrl}
                                prompt={card.prompt}
                                onGenerate={(prompt) => setView('generator', { initialPrompt: prompt })}
                                index={index + 1}
                            />
                        ))}
                    </div>
                     {studioCardsData.length > 15 && (
                        <div className="text-center mt-12">
                            <ActionButton
                                onClick={() => {
                                    if (visibleCards >= studioCardsData.length) {
                                        setVisibleCards(15);
                                    } else {
                                        setVisibleCards(prev => Math.min(prev + 15, studioCardsData.length));
                                    }
                                }}
                                className="bg-brand-primary dark:bg-brand-accent text-white font-bold py-3 px-8 rounded-lg hover:bg-brand-primary-dark dark:hover:bg-brand-accent-dark transition duration-300 transform hover:-translate-y-1 hover:shadow-2xl"
                            >
                                {visibleCards >= studioCardsData.length ? t('show_less') : t('more_creativity')}
                            </ActionButton>
                        </div>
                    )}
                </div>
            );
        case 'images':
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 md:mb-32 animate-fade-in">
                    <Card icon={<PaintBrushIcon />} title={t('editor_card_title')} description={t('editor_card_desc')} buttonText={t('start_editing')} onClick={() => setView('editor')} isBeta={true} />
                    <Card icon={<SparklesIcon />} title={t('generator_card_title')} description={t('generator_card_desc')} buttonText={t('start_generating')} onClick={() => setView('generator')} />
                    <Card icon={<WandIcon />} title={t('enhancer_card_title')} description={t('enhancer_card_desc')} buttonText={t('start_enhancing')} onClick={() => setView('enhancer')} />
                    <Card icon={<CombineIcon />} title={t('merger_card_title')} description={t('merger_card_desc')} buttonText={t('start_merging')} onClick={() => setView('merger')} isBeta={true} />
                    <Card icon={<RestorerIcon />} title={t('restorer_card_title')} description={t('restorer_card_desc')} buttonText={t('start_restoring')} onClick={() => setView('restorer')} isBeta={true} />
                    <Card icon={<PencilRulerIcon />} title={t('corrector_card_title')} description={t('corrector_card_desc')} buttonText={t('start_correcting')} onClick={() => setView('corrector')} isBeta={true} />
                    <Card icon={<DocumentTextIcon />} title={t('prompt_extractor_card_title')} description={t('prompt_extractor_card_desc')} buttonText={t('start_prompt_extracting')} onClick={() => setView('prompt_extractor')} isBeta={true} />
                </div>
            );
        case 'text':
            return (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 md:mb-32 animate-fade-in">
                    <Card icon={<WriterIcon />} title={t('writer_card_title')} description={t('writer_card_desc')} buttonText={t('start_writing')} onClick={() => setView('writer')} isBeta={true} />
                    <Card icon={<TranslatorIcon />} title={t('translator_card_title')} description={t('translator_card_desc')} buttonText={t('start_translating')} onClick={() => setView('translator')} isBeta={true} />
                    <Card icon={<ProofreaderIcon />} title={t('proofreader_card_title')} description={t('proofreader_card_desc')} buttonText={t('start_proofreading')} onClick={() => setView('proofreader')} isBeta={true} />
                    <Card icon={<StealthIcon />} title={t('stealth_card_title')} description={t('stealth_card_desc')} buttonText={t('start_stealthing')} onClick={() => setView('stealth')} isBeta={true} />
                    <Card icon={<SummarizerIcon />} title={t('summarizer_card_title')} description={t('summarizer_card_desc')} buttonText={t('start_summarizing')} onClick={() => setView('summarizer')} isBeta={true} />
                    <Card icon={<TextExtractorIcon />} title={t('text_extractor_card_title')} description={t('text_extractor_card_desc')} buttonText={t('start_text_extracting')} onClick={() => setView('text_extractor')} isBeta={true} />
                </div>
            );
        default:
            return (
                <div className="text-center py-20 md:py-32 mb-20 md:mb-32 animate-fade-in">
                    <h3 className="text-3xl font-bold text-brand-primary dark:text-white mb-4">{t('coming_soon_title')}</h3>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">{t('coming_soon_desc')}</p>
                </div>
            );
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-brand-primary dark:text-white mb-4">{t('landing_title')}</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">{t('landing_subtitle')}</p>
      </div>
      
      {/* Content Type Selector */}
      <div className="flex justify-center my-8 md:my-12">
        <div className="bg-gray-200/50 dark:bg-gray-800/50 p-1.5 rounded-full shadow-inner flex items-center gap-2 flex-wrap justify-center">
          {contentTypes.map((type) => {
            const isActive = activeContentType === type;
            return (
              <button
                key={type}
                onClick={() => setActiveContentType(type)}
                className={`group py-2 px-4 rounded-full font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:ring-offset-2 dark:focus:ring-offset-gray-800 grid items-center
                  ${isActive
                    ? 'bg-brand-accent text-white shadow-sm grid-cols-[auto_1fr] gap-2'
                    : 'text-brand-accent hover:bg-gray-100 dark:hover:bg-gray-700 grid-cols-[auto_0fr] gap-0 hover:grid-cols-[auto_1fr] hover:gap-2'
                  }
                `}
              >
                {contentTypeIcons[type]}
                <div className="overflow-hidden">
                    <span className="whitespace-nowrap block">
                      {t(`content_type_${type}`)}
                    </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
      
      {renderContent()}
      
      {/* Informational Tabs */}
      <div className="flex justify-center mb-8 md:mb-12">
        <div className="bg-gray-200/50 dark:bg-gray-800/50 p-1.5 rounded-full shadow-inner flex items-center gap-2 flex-wrap justify-center">
          {infoTabs.map((tab) => {
             const isActive = activeInfoTab === tab;
             return (
              <button
                key={tab}
                onClick={() => setActiveInfoTab(tab)}
                className={`group py-2 px-4 rounded-full font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:ring-offset-2 dark:focus:ring-offset-gray-800 grid items-center
                  ${isActive
                    ? 'bg-brand-accent text-white shadow-sm grid-cols-[auto_1fr] gap-2'
                    : 'text-brand-accent hover:bg-gray-100 dark:hover:bg-gray-700 grid-cols-[auto_0fr] gap-0 hover:grid-cols-[auto_1fr] hover:gap-2'
                  }
                `}
              >
                {infoTabIcons[tab]}
                 <div className="overflow-hidden">
                    <span className="whitespace-nowrap block">
                      {t(`info_tab_${tab}`)}
                    </span>
                </div>
              </button>
             )
          })}
        </div>
      </div>
      
      <div key={activeInfoTab} className="animate-fade-in">
        {renderInfoContent()}
      </div>

    </div>
  );
};