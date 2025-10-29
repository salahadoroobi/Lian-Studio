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
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "A highly detailed black and white portrait of a man (fit the attached image) with a rugged, textured face, wet skin glistening under soft, directional lighting. The image captures half of his face, emphasizing the forehead, eye, nose, and mouth, with water droplets and small bubbles on his skin, creating a sense of moisture and intensity. His eye is sharp and piercing, with a contemplative expression. The background is completely black, enhancing the dramatic contrast and highlighting the contours and textures of his face. The lighting accentuates the natural details of his skin, stubble, and facial features, creating a moody, cinematic atmosphere. The overall composition is close-up, emphasizing raw emotion and the tactile quality of the wet skin."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Without changing my face or hairstyle, create an analogue portrait from the year 2025. The background is Tokyo, Japan, with a supercar. I'm in the car seat, posing like a Korean model, with an aerial view of the car's interior, looking forward. I'm wearing an oversized hoodie, black pants with ripped knees, and low-top Nike Air Jordans. My body is visible from inside the car. Body ratio: 3/4 of the image"
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "A stylish man with a muscular build leans against a concrete wall in an urban, industrial setting(use reference photo). He is wearing a sharp white suit with a matching blazer and trousers, paired with a deep maroon dress shirt underneath. The shirt is unbuttoned at the top, adding a bold and confident vibe. He wears aviator-style sunglasses with patterned arms and a luxury wristwatch on his left wrist. His right hand rests casually in his pocket, while his left arm leans on the wall,"
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Place me sitting at a super elegant table. I am wearing an all-black suit black shirt with a silver watch visible on my wrist.\nThe atmosphere should be refined and luxurious, with a sophisticated setting - a modern fine-dining restaurant or a high-end lounge, with soft ambient lighting, crystal glasses, and polished details on the table. Keep my exact facial features from the reference photo, blending naturally with the scene. Hyper-realistic, cinematic, stylish, and classy mood."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "A nighttime flash photograph with a raw Y2K aesthetic, featuring the user at a public payphone. He is turning his head back toward the camera with a detached, almost indifferent expression. He is wearing a baggy T-shirt and loose cargo jeans, one hand holding the phone receiver.\nTake only the exact facial features from the user's reference photo — preserve all face proportions, skin tone, and hair style exactly. Do NOT copy clothing from the reference, use the clothing/style described in the prompt. Ultra-consistent identity across all generations.\nStrong harsh flash lighting creates deep contrast and blown-out highlights, casting sharp shadows on the pavement. Blurred car lights streak across the urban background, adding motion and chaos. A red digital timestamp is visible in the bottom corner, evoking early 2000s disposable camera photography. Slight grain, chromatic aberration, and soft blur for realism. Hyperdetailed 8k super-resolution, candid paparazzi snapshot vibe, raw and nostalgic Y2K mood."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "A hyper-realistic ultra-close-up portrait of the user underwater, face partially lit with moving caustic light patterns casting across his skin. Tiny air bubbles float around, water surface reflections shimmer softly. Expression is intense and serious, with cinematic focus on the eyes.\nTake only the exact facial features from the user's reference photo — preserve all face proportions, skin tone, and hair style exactly. Do NOT copy clothing from the reference, use the clothing/style described in the prompt. Ultra-consistent identity across all generations.\nMoody teal-green color grading, dramatic contrast, hyperdetailed skin texture with wet highlights, visible water particles, shallow depth of field (f/1.4), 8k super-resolution, cinematic composition, IMG_9999.CR2, shot on Leica SL2, editorial underwater photography style."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Use my uploaded photo as a reference with full sharpness and exact facial features. A man sits on a street column with a confident expression, 3/4 body relaxed.\nAppearance: moss green bomber jacket, tight black t-shirt, dark skinny jeans, and clean white sneakers. Dark sunglasses add a touch of charisma.\nScene: Avenida de Roma, with passing cars, tall buildings, and the Colosseum in the distant background.\nTechnical data sheet:\nStyle: Cosmopolitan street\nResolution: hyper-realistic portrait\nLighting: natural cloudy light, with rays breaking through clouds + urban reflections\nFrame: 3/4 body sitting\nLens: 35mm f/2.0\nColors: moss green, black, white, yellow."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "The cinematic golden watch image of the same person from the Jinal selfie, sitting in the open window of a luxury car (G-Class or Brabus), and the left arm rests on the edge of the door.\nThe subject wears black sunglasses and a dark shirt or shirt. Warm sunlight floods the car, casting orange flares and soft shades on the face. Slightly confused hair due to the breeze. The expression is comfortable and confident. Shallow depth of field, lens glare, and rich sunset tones. High-resolution editorial esthetic, photographed with low ISO and main lens. A mood glow that can be Instagram."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "A sudden flash of an iPhone pierces the deep blackness, revealing his cool, half-buried sand as he relaxes with his bare feet. His soft, linen button-down shirt flutters slightly, not unlike a welcoming sea breeze, styled seamlessly with tailored shorts that exude sophistication. The faint moonlight glistens, and the clean shoreline highlights the faint sheen of his sun-kissed locks, accentuating them more precisely. A photo that enhances his calm and poise, taken on an iPhone, without altering the person's features.\nMake it stand."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "A sudden flash of an iPhone pierces the deep blackness, revealing his cool, half-buried sand as he relaxes with his bare feet. His soft, linen button-down shirt flutters slightly, not unlike a welcoming sea breeze, styled seamlessly with tailored shorts that exude sophistication. The faint moonlight glistens, and the clean shoreline highlights the faint sheen of his sun-kissed locks, accentuating them more precisely. A photo that enhances his calm and poise, taken on an iPhone, without altering the person's features.\nMake him hold the sand in his hands."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "High-resolution 8K cinematic image of the man in the uploaded image, sitting on a wooden chair with his arms crossed on the chair's back. He's wearing an oversized white T-shirt, black pants, an Apple Watch, and stylish sunglasses. A strong spotlight filters through the Venetian blinds, casting dramatic shadows on his face, body, and the background wall. The composition is simple, with a dark, neutral background and geometric lighting patterns. His expression is both confident and calm, giving the image an elegant cinematic feel\nImportant: The face and hairstyle must\nmatch exactly the reference image provided. Maintain the same texture and length of the hairstyle, and the same facial proportions. The lighting should mimic the effect of the striped shadow cast by the blinds on his face and body. The person should remain seated on the wooden chair with their arms crossed, not standing"
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "The cinematic golden watch image of the same person from the Jinal selfie, sitting in the open window of a luxury car (G-Class or Brabus), and the left arm rests on the edge of the door.\n743The subject wears black sunglasses and a dark shirt or shirt. Warm sunlight floods the car, casting orange flares and soft shades on the face. Slightly confused hair due to the breeze. The expression is comfortable and confident. Shallow depth of field, lens glare, and rich sunset tones. High-resolution editorial 663esthetic, photographed with low ISO and main lens. A mood glow that can be Instagram."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "A hyper-realistic cinematic close-up portrait of the user standing in heavy rain at night, face slightly turned to the side, wearing black rectangular glasses and a dark denim jacket. Water droplets run down his face and glasses, wet hair clinging to his forehead.\nTake only the exact facial features from the user's reference photo — preserve all face proportions, skin tone, and hair style exactly. Do NOT copy clothing from the reference, use the clothing/style described in the prompt. Ultra-consistent identity across all generations.\nMoody golden backlight creating a soft halo around his wet hair, strong cinematic contrast, shallow depth of field (f/1.4), visible rain streaks in foreground, dramatic film grain, desaturated cinematic tones, IMG_9940.CR2, shot on Leica M11, hyperdetailed 8k super-resolution, intimate emotional mood, film still aesthetic."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "A gritty cinematic black-and-white mid-shot of the user standing shirtless in an underground fight club, sweat glistening on his skin under harsh industrial overhead lights. Medium-dark skin tone rendered in deep monochrome contrast, sharp well-groomed beard, slicked-back slightly messy hair. His fists are wrapped in white fight tape, one arm casually resting on a chain-link fence, the other gripping a water bottle loosely.\nTake only the exact facial features from the user's reference photo — preserve all face proportions, skin tone, and hair style exactly. Ultra-consistent identity across all generations.\nThe background shows a blurred, shadowy crowd behind the fence, smoke and haze filling the air for a raw, tense atmosphere. Lighting is dramatic and directional, casting harsh shadows across the chest and face, highlighting muscle definition. Cinematic framing, deep blacks and clean highlights, fine 35mm film grain, Leica SL2 medium format look, hyperdetailed 8k super-resolution, moody noir-style grading,"
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Full body portrait of a man standing confidently, wearing a turquoise/blue hoodie, black pants, and white sneakers with red and orange accents. Hands in pockets, neutral expression, glasses. Artistic studio photography with a clean teal background. Behind him, dynamic colorful paint splash effect in orange and teal, high contrast, glowing splatter energy, modern digital art style, cinematic lighting, sharp details, Ultra realistic, 8k, dramatic lighting, professional studio photo."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "A retro 1980s-style portrait of a man wearing a colorful vintage windbreaker jacket with geometric patterns. He is confidently holding a large silver boombox on his shoulder, standing against a soft studio background. The photo has a nostalgic vibe with bold colors, slightly faded tones, a realistic washed-out look of an authentic 1980s photograph, and subtle film grain for extra realism. Lighting: a soft glow inspired by the past with light haze/fog. Style: an editorial look with strong 1980s character. Use the reference face (take 100% of the facial features and hairstyle from the uploaded image)."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "A surreal aerial view of a man lying on a sandy beach with a white pillow under his head, arms resting behind his head in a relaxed pose, as ocean waves crash dramatically over his body. The perspective is top-down, cinematic, and highly detailed, with clear contrast between the brown sand, foamy white surf, and turquoise water. Ultra-realistic photography style, high definition, vibrant colors, natural lighting."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "A hyper-realistic cinematic black-and-white portrait of the user standing in an open field, shot from an extreme low angle looking slightly upward, creating a dramatic towering silhouette. He is wearing a long dark overcoat with both hands in his pockets, standing perfectly still with an intense, stoic expression.\nTake only the exact facial features from the user's reference photo — preserve all face proportions, skin tone, and hairstyle exactly. Ultra-consistent identity across all generations.\nHundreds of pigeons are frozen mid-flight around him, with some close to the camera wings blurred for depth and motion, others far away forming a scattered pattern across the cloudy, overcast sky. The foreground birds should frame the subject naturally, creating a sense of movement and chaos around his stillness.\nLighting is soft but contrasty, with deep shadows and clean highlights — think fine art black-and-white photography. Subtle fine 35mm"
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Without changing my face or hairstyle, create an analogue portrait from the year 2025. The background is Tokyo, Japan, with a supercar. I'm in the car seat, posing like a Korean model, with an aerial view of the car's interior, looking forward. I'm wearing an oversized hoodie, black pants with ripped knees, and low-top Nike Air Jordans. My body is visible from inside the car. Body ratio: 3/4 of the image"
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "A stylish man with a dark beard and sunglasses, wearing a black turtleneck sweater, grey cargo pants, and black boots. He is crouching down next to a majestic black horse. Both are in a snowy mountain landscape under a clear sky. Snowflakes are gently falling around them. The man is holding the horse's lead. The overall mood is cool, serene, and adventurous.\""
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "A young Indonesian man, based on the attached photo (keep his exact face and hairstyle without any changes, do not crop or alter the face), wearing a thick white jacket with fine details, a red scarf, and casual jogger pants. An extreme low-angle view from below shows him stepping forward confidently. The main focus is on the bottom of his shoes, which feature bright white and red soles with intricate straps and buckles. He looks down toward the camera with a faint, relaxed smile and warm black eyes.\nThe background shows a clear blue sky, dotted with soft white clouds and construction cranes, making the subject stand out. The lighting is natural, bright, and clean during the day, emphasizing the contrast between his outfit and the vivid sky."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "A cinematic shot capturing the essence of the Middle East, a man shrouded in a richly textured golden fabric with intricate Arabic calligraphy patterns. He stands amidst a desert landscape at sunset, with golden dust and light particles shimmering around him, creating a mystical and awe-inspiring atmosphere. The focus is on his intense gaze, emphasizing strength and dignity. The scene evokes a sense of ancient wisdom and modern luxury, blending tradition with a contemporary aesthetic.\""
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "A cinematic, highly realistic outdoor portrait.\nThe subject is a person (whose specific facial features will be provided by an external image reference). This person is depicted wearing a plain black t-shirt and dark sunglasses. A traditional black and white **Keffiyeh** scarf is draped casually over their left shoulder (from the viewer's perspective), and they are holding the edge of the Keffiyeh with their right hand in a relaxed, confident pose.\n**Composition and Pose:**\n* The person is standing with their body slightly angled to the side, but their head turned towards the camera, making direct eye contact.\n* This should be a **medium shot to a three-quarter shot**, showing the person from the waist up or knees up, framed similar to a professional editorial photograph.\n**Background:**\n* The **Dome of the Rock (Qubbat Al-Sakhra)** in Jerusalem is prominently visible directly behind the subject, slightly out of focus (bokeh effect) to create depth and emphasize the foreground. Its iconic golden dome and th"
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "A medium shot of a man in uploaded picture (use the same face and facial), sitting on a wooden crate in what appears to be an industrial or rustic setting with brick walls and metal structures in the background, out of focus.\nThe brick wall painted an Graffiti-style with legend of Real Madrid \"modric\" and text with black and white and purple colours font \"Hala Madrid\"\nHe is looking directly at the camera with a serious or confident expression.\nHe is wearing a white Real Madrid UEFA Champions League full-patch 2025 jersey, black jeans, and light white, - nike sneakers."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Ultra-realistic cinematic portrait of a young Middle Eastern man sitting confidently on a wicker sofa in the desert at sunset. He is wearing a traditional black outfit with golden embroidery, smoking shisha with smoke rising naturally. A luxury black SUV is parked behind him in the sand dunes. The atmosphere is powerful, dramatic, and cinematic, with warm orange and red sunset tones in the sky. Highly detailed, sharp focus, 8k resolution, photorealistic."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Studio portrait of a sophisticated man seated in a dark brown leather armchair, exuding confidence and authority. He is wearing a tailored navy-blue suit, crisp white shirt, textured dark tie, and a folded pocket square. His posture is elegant with crossed legs and hands resting on the chair’s arms. The setting conveys luxury and refinement, with soft, directional lighting highlighting the facial structure and suit details.\nTechnical Details:\n• Lighting: soft key light from a large softbox at 45° to the subject’s face, with gentle fill on the opposite side to maintain contrast. Subtle rim light behind to separate subject from background.\n• Background: upscale interior, softly blurred (bokeh), with classic décor elements such as a la"
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "A hyper-realistic cinematic black-and-white portrait of the user standing in an open field, shot from an extreme low angle looking slightly upward, creating a dramatic towering silhouette. He is wearing a long dark overcoat with both hands in his pockets, standing perfectly still with an intense, stoic expression.\n‎Take only the exact facial features from the user's reference photo — preserve all face proportions, skin tone, and hairstyle exactly. Ultra-consistent identity across all generations.\n‎Hundreds of pigeons are frozen mid-flight around him, with some close to the camera wings blurred for depth and motion, others far away forming a scattered pattern across the cloudy, overcast sky. The foreground birds should frame the subject naturally, creating a sense of movement and chaos around his stillness.\n‎Lighting is soft but contrasty, with deep shadows and clean highlights — think fine art black-and-white photography. Subtle fine 35mm film grain, Leica M11 + Summicron lens look, sharp subject focus with slightly softer vignette edges. Hyperdetailed 8k super-resolution, moody and editorial fashion campaign atmosphere, timeless and surreal.\""
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "Ultra-realistic fashion editorial photoshoot of a male model (keep same face & hairstyle as uploaded photo, do not change facial expression).\nOutfit: oversized textured white sweatshirt (slightly structured fabric), futuristic oversized combat jeans in muted neon lemon-green with exaggerated silhouette.\nFootwear: lemon-green Nike sneakers with bold sole details, styled with white ribbed socks.\nPose: model seated on a sleek modern metallic cube, elegant yet relaxed posture, one arm resting casually, gaze slightly off-camera.\nEnvironment: futuristic muted lemon-green gradient studio background with subtle geometric light streaks.\nLighting: cinematic soft glow with subtle rim-light highlighting skin contours and fabric textures, fashion magazine quality.\nStyle: futuristic x editorial, clean minimalism with avant-garde vibe.\nComposition: full-body centered shot with negative space around the model, perfect for magazine cover."
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "‏:A hyper- realistic image of a confident,\nStylish young man (face should match\nthe uploaded refcrence imagc)\nsitting on a luxurious dark brown\nlcather chestetrfield sofa in a dimly lit,\nopulrent room.He is drcssed sharply\nin a white suit with a black shirt\nslightly unbuttoned, wearing white\nleather shoes, a wristwatch, and dark\nsunglasses. His pose is relaxed, with\none leg crosscd and one arm casually\nresting on the armrest.the setting\nfeatures a dark, moody background\nwith rich whitc walls, a classic\nchandclietr with warm glowing bulbs\nhanging abave, and a gothic-style\npainting af a hoodred skull figure\nbehind him the atmosphere is\nintense, cinematic, and mysterious,\nwith dramatic lighting emphasizing\nelegance,pawer,and control.\nstyle: hyper-realistic,cinematic\nlighting,rich tones, dark aesthetic\nFace: match exactly with the\nuploaded image\nAspect Ratio: 3:2 or 4:5 vertical\ncamera angle: eye level, symmetrical\nframe\nMood: powerful, elite, mysterious,\nnoir-inspired"
    },
    {
        imageUrl: "https://via.placeholder.com/500/2a3c73/f4f5f1?text=Lian+Studio",
        prompt: "A hyper-realistic 4K professional photo of the same man from the reference image, preserving his exact facial features, eyes, hairstyle, and skin tone. He is posing proudly with the Ballon d'Or trophy, standing in a glamorous award ceremony setting. The golden trophy is held in his hands or placed on a pedestal beside him, shining under dramatic warm lighting. He is dressed in an elegant suit, styled like a professional football award winner, with cinematic lighting that highlights both his presence and the glowing golden ball. The atmosphere feels prestigious, luxurious, and powerful, captured with ultra-sharp details and a high-end editorial photography style."
    }
];

const FeatureCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    language: Language;
  }> = ({ icon, title, description, language }) => (
    <div className={`flex items-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm gap-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
        <div className="flex-shrink-0 w-12 h-12">{icon}</div>
        <div>
            <h4 className="text-xl font-bold text-brand-primary dark:text-white">{title}</h4>
            <p className="text-brand-primary dark:text-gray-400">{description}</p>
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
                <section className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-brand-primary dark:text-white mb-8">{t('landing_features_title')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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