<template>
  <div class="flex flex-col items-center justify-center">
    <!-- Section 1: Quick Explanation -->
    <section class="w-full h-72 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center flex flex-col justify-center items-center">
      <h1 class="text-4xl font-bold mb-4">Create AI Photos of You and Your Friends</h1>
      <p class="text-xl mb-8">Choose clothes, location, time period, and more!</p>
      <button 
        @click="navigateToLogin" 
        class="p-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 border-green-300 border-2 shadow-green-400"
      >
        <i class="pi pi-images mr-2"></i>
        Create Photos Now
      </button>
    </section>

    <section class="container mx-auto pt-4 pb-16">
      <div class="flex flex-col md:flex-row items-center justify-center">
        <div class="text-center">
          <h3 class="text-2xl font-bold mb-4">User Photos</h3>
          <div class="flex justify-center mb-0">
            <div class="grid grid-cols-2 gap-4 w-fit">
              <NuxtImg v-for="image in userRealPhotos"
                :key="image.alt"
                :src="image.itemImageSrc"
                alt="real user photo"
                class="w-36 h-56 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
        <div class="hidden sm:block">
          <i class="pi pi-arrow-right text-7xl text-center px-6 mt-12"></i>
        </div>
        <div class="block sm:hidden">
          <i class="pi pi-arrow-down text-7xl text-center px-6 mt-12"></i>
        </div>
        <div class="text-center flex flex-col items-center mt-9">
          <h3 class="text-2xl font-bold mb-4">AI Images</h3>
          <Carousel :value="userAiImages" :numVisible="1" :numScroll="1" :autoplayInterval="3000" :circular="true" class="w-full max-w-md">
            <template #item="slotProps">
              <div class="flex justify-center">
                <NuxtImg :src="slotProps.data.itemImageSrc" :alt="slotProps.data.alt" class="w-80 h-120 object-cover rounded-lg" />
              </div>
            </template>
          </Carousel>
        </div>
      </div>
    </section>

    <!-- Section 3: Testimonials -->
    <section class="bg-gray-800 w-full py-12">
      <div class="container mx-auto">
        <h2 class="text-3xl font-bold text-center text-white mb-8">What Our Users Say</h2>
        <!-- Desktop view: columns -->
        <div class="hidden md:grid grid-cols-3 gap-6">
          <div v-for="testimonial in testimonials" :key="testimonial.name" class="bg-gray-600 rounded-lg p-2 shadow-lg">
            <TestimonialCard :testimonial="testimonial" />
          </div>
        </div>
        <!-- Mobile view: carousel -->
        <div class="md:hidden">
          <Carousel :value="testimonials" :numVisible="1" :numScroll="1" :responsiveOptions="carouselResponsiveOptions">
            <template #item="slotProps">
              <div class="p-4">
                <TestimonialCard :testimonial="slotProps.data" />
              </div>
            </template>
          </Carousel>
        </div>
      </div>
    </section>

    <!-- Section 4: AI-Created Images Gallery -->
  <section class="container mx-auto py-16">
    <h2 class="text-3xl font-bold text-center mb-8">AI-Created Images</h2>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
      <div v-for="image in aiImages" :key="image.alt" class="aspect-[2/3]">
        <NuxtImg :src="image.itemImageSrc" :alt="image.alt" class="w-full h-full object-cover rounded-lg" />
      </div>
    </div>
  </section>

    <!-- Section 5: Login Button -->
    <section class="w-full py-32 bg-gradient-to-r from-blue-600 to-purple-700 text-white text-center">
      <h2 class="text-4xl font-bold mb-4">Ready to Create Your Own Photos?</h2>
      <button 
        @click="navigateToLogin" 
        class="p-4 bg-gradient-to-r from-yellow-500 to-amber-500 text-gray-900 font-bold rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 border-yellow-300 border-2 shadow-yellow-400"
      >
        <i class="pi pi-images mr-2"></i>
        Create Photos Now
      </button>
    </section>

    <!-- Section 6: FAQ -->
    <section class="container mx-auto py-16">
      <h2 class="text-3xl font-bold text-center mb-6">FAQ</h2>
      <Accordion :multiple="true">
        <AccordionTab v-for="faq in faqs" :key="faq.question" :header="faq.question" >
          <p>{{ faq.answer }}</p>
        </AccordionTab>
      </Accordion>
    </section>

    <!-- Section 7: Comparison with Competitors -->
    <section class="w-full py-16 bg-gradient-to-r from-blue-600 to-purple-700">
      <div class="container mx-auto sm:w-full md:w-full  lg:w-4/5 xl:w-3/5 2xl:w-2/5">
        <h2 class="text-3xl font-bold text-center text-white mb-8">How does TakePics.AI compare to other AI image services?</h2>
        <div class="flex flex-col md:flex-row justify-center items-stretch gap-6">
          <ComparisonCard
            title="Midjourney 3"
            imageSrc="/images/compare/midjourney3.jpg"
            :features="{
              realPersonModel: false,
              lowResemblance: false,
              mediumRealism: true,
              mediumResolution: true,
              clearAndSharp: false
            }"
          />
          <ComparisonCard
            title="TakePics.AI"
            imageSrc="/images/compare/takepicsai.jpg"
            :features="{
              realPersonModel: true,
              highResemblance: true,
              highPhotorealism: true,
              highResolution: true,
              clearAndSharp: true
            }"
            highlighted
          />
          <ComparisonCard
            title="DALL-E 3"
            imageSrc="/images/compare/dalle3.jpg"
            :features="{
              realPersonModel: false,
              noResemblance: false,
              lowPhotorealism: false,
              lowResolution: false,
              clearAndSharp: false
            }"
          />
        </div>
      </div>
    </section>

    <!-- Section 8: Photo Packs -->
    <section class="container mx-auto py-16">
      <h2 class="text-3xl font-bold text-center mb-8">Explore Our Photo Packs</h2>
      <div class="grid grid-cols-2 px-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6 gap-6 h-1/2">
        <div v-for="pack in photoPacks" :key="pack.name" class="card w-full">
          <div class="">
            <NuxtImg :src="pack.image" :alt="pack.name" class="w-full object-cover rounded-t-lg" />
          </div>
          <div class="p-2 md:p-4 bg-gray-800 border-t-0 rounded-b-lg">
            <h3 class="text-xl font-bold mb-2">{{ pack.name }}</h3>
            <p>{{ pack.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 9: Final CTA -->
    <section class="w-full py-16 bg-gradient-to-r from-purple-600 to-blue-500 text-white text-center">
      <h2 class="text-3xl font-bold mb-4">Create Your AI Model and Photos Now</h2>
      <p class="text-xl mb-8">Join thousands of satisfied users today!</p>
      <button 
        @click="navigateToLogin" 
        class="p-4 bg-gradient-to-r from-red-500 to-rose-700 text-white font-bold rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 border-red-400 border-2 shadow-red-400"
      >
        <i class="pi pi-images mr-2"></i>
        Start Now
      </button>
    </section>

    <!-- Section 10: Footer -->
    <footer class="w-full bg-gray-800 text-white py-8">
      <div class="container mx-auto flex flex-wrap justify-between">
        <div class="w-full md:w-1/3 px-8 mb-6 md:mb-0">
          <h4 class="text-lg font-bold mb-4">TakePics.AI</h4>
          <p>Create awesome AI-generated photos for you and your friends.</p>
        </div>
        <div class="w-full md:w-1/3 px-8 mb-6 md:mb-0">
          <!-- <h4 class="text-lg font-bold mb-4">Quick Links</h4>
          <ul>
            <li><a href="#" class="hover:text-gray-300">Home</a></li>
            <li><a href="#" class="hover:text-gray-300">Pricing</a></li>
            <li><a href="#" class="hover:text-gray-300">FAQ</a></li>
            <li><a href="#" class="hover:text-gray-300">Contact</a></li>
          </ul> -->
        </div>
        <div class="w-full md:w-1/3 px-8">
          <!-- <h4 class="text-lg font-bold mb-4">Newsletter</h4>
          <InputText placeholder="Enter your email" class="w-full mb-2" />
          <Button label="Subscribe" class="w-full" /> -->
        </div>
      </div>
      <div class="mt-8 text-center">
        <p>&copy; 2024 AI Photo Generation. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

definePageMeta({
  auth: false
});

const router = useRouter();

const navigateToLogin = () => {
  router.push('/pricing');
};

// Testimonials data
const testimonials = ref([
  { 
    quote: "I loved creating stickers of my friends and family. They are so much fun!",
    name: "Aurora Levington",
    avatar: "/images/aurora.jpeg",
    company: "Influencer",
    rating: 5,
    verified: true
  },
  { 
    quote: "The most fun I've had with AI images. Amazing historical and fictional themes.",
    name: "Tom Fischer",
    avatar: "/images/tech-vanguard.jpeg",
    company: "Vanguard Tech",
    rating: 5,
    verified: true
  },
  { 
    quote: "The variety of styles and clothing is impressive. Highly recommended!",
    name: "Sebastian Muller",
    avatar: "/images/creative-studios.jpeg",
    company: "Creative Studios",
    rating: 4,
    verified: true
  },
]);

const carouselResponsiveOptions = ref([
  {
    breakpoint: '1024px',
    numVisible: 3,
    numScroll: 3
  },
  {
    breakpoint: '768px',
    numVisible: 2,
    numScroll: 2
  },
  {
    breakpoint: '560px',
    numVisible: 1,
    numScroll: 1
  }
]);

// User real photos
const userRealPhotos = ref([
  { itemImageSrc: '/images/novak/real-1.jpeg', alt: 'AI Image 1' },
  { itemImageSrc: '/images/novak/real-2.jpeg', alt: 'AI Image 3' },
  { itemImageSrc: '/images/novak/real-3.jpeg', alt: 'AI Image 4' },
  { itemImageSrc: '/images/novak/real-4.jpeg', alt: 'AI Image 5' },
]);

// AI-created images data
const userAiImages = ref([
  { itemImageSrc: '/images/novak/mount-fuji.jpeg', alt: 'AI Image 1' },
  { itemImageSrc: '/images/novak/superman.jpeg', alt: 'AI Image 3' },
  { itemImageSrc: '/images/novak/dj.jpeg', alt: 'AI Image 4' },
  { itemImageSrc: '/images/novak/russian.jpeg', alt: 'AI Image 5' },
]);

// AI-created images data
const aiImages = ref([
  { itemImageSrc: '/images/vitoria/princess.jpeg', alt: 'AI Image 3' },
  { itemImageSrc: '/images/dantas/maestro.jpeg', alt: 'AI Image 2' },
  { itemImageSrc: '/images/sarah/smiling.jpeg', alt: 'AI Image 4' },
  { itemImageSrc: '/images/fernando-business.jpeg', alt: 'AI Image 3' },
  { itemImageSrc: '/images/alicia/beach-sunset.jpeg', alt: 'AI Image 3' },
  { itemImageSrc: '/images/fernando-meditation.jpeg', alt: 'AI Image 3' },
  { itemImageSrc: '/images/novak/napoleon.jpeg', alt: 'AI Image 4' },
  { itemImageSrc: '/images/alicia/spaceship.jpeg', alt: 'AI Image 5' },
  { itemImageSrc: '/images/sarah/art.jpeg', alt: 'AI Image 4' },
  { itemImageSrc: '/images/alicia/doctor.jpeg', alt: 'AI Image 1' },
  { itemImageSrc: '/images/novak/royalty.jpeg', alt: 'AI Image 5' },
  { itemImageSrc: '/images/joseph-library.jpeg', alt: 'AI Image 3' },
  { itemImageSrc: '/images/vitoria/farmer.jpeg', alt: 'AI Image 3' },
  { itemImageSrc: '/images/dantas/king.jpeg', alt: 'AI Image 5' },
  { itemImageSrc: '/images/dantas/noble.jpeg', alt: 'AI Image 5' },
  { itemImageSrc: '/images/ian-cook.jpeg', alt: 'AI Image 3' },
  { itemImageSrc: '/images/alicia/broadway.jpeg', alt: 'AI Image 5' },
  { itemImageSrc: '/images/alicia/twilight.jpeg', alt: 'AI Image 5' },
  { itemImageSrc: '/images/sarah/cyberpunk.jpeg', alt: 'AI Image 5' },
  { itemImageSrc: '/images/novak/spaceship.jpeg', alt: 'AI Image 5' },
  { itemImageSrc: '/images/alicia/model-runway.jpeg', alt: 'AI Image 5' },
  { itemImageSrc: '/images/vitoria/witch.jpeg', alt: 'AI Image 3' },
  { itemImageSrc: '/images/fernando-judo.jpeg', alt: 'AI Image 3' },
  { itemImageSrc: '/images/dantas/emperor.jpeg', alt: 'AI Image 5' },
]);

const galleriaResponsiveOptions = ref([
  {
    breakpoint: '1024px',
    numVisible: 5
  },
  {
    breakpoint: '768px',
    numVisible: 3
  },
  {
    breakpoint: '560px',
    numVisible: 1
  }
]);

// FAQ data
const faqs = ref([
  { question: "How does it work?", answer: "Just 2 steps: 1) Upload a few photos of you or someone else and click 'train model'. After a few minutes our AI will learn the person's features. 2) Once the model is trained, you can create photos of that person in any clothes, location, and time period!" },
  { question: "How long does it take to generate AI photos?", answer: "Approximately 40 seconds, and you can create many at the same time.Keep in mind that to create a new model (new person, it takes ~1h for the AI to learn the person's features. This is the training time and only has to be done once per person you want to create images of. Then, each image is generated in less than 40 seconds." },
  { question: "Can I create images of someone other than myself?", answer: "Yes, you can create images of anyone, as long as you have their photos and their permission. That said, the current state of AI limits images to contain only one person." },
  { question: "Can I use the photos commercially?", answer: "Yes." },
  { question: "Can I train a model that is pet or product instead of a person?", answer: "Yes, although this software was intended for people first, we are working on improving the experience for creating images of pets and products." },
  { question: "Can I download the images I created?", answer: "Yes, you can download the images you created." },
  { question: "What do you do with my photos?", answer: "Your real photos are used to train your AI, that only you have access to. You can delete your account any time and your photos will be deleted as well. Your AI created images are yours to use as you want." },
  { question: "Is it refundable?", answer: "No, unfortunately it's not refundable due to the GPU (processing) costs associated with training the AI models." },
  { question: "Can I create videos? What about sounds?", answer: "Not yet, but we are actively working on adding video and sound generation features soon!" },
  { question: "How do I generate multiple images at a time?", answer: "You don't have to wait for one image to finish before starting another, so you can generate multiple images simultaneously." }
]);

// Photo packs data
const photoPacks = ref([
  { name: "Travel", image: "/images/novak/travel.jpeg", description: "Transform yourself into a globe-trotter" },
  { name: "Royalty", image: "/images/novak/royalty.jpeg", description: "Become a king or queen for a day" },
  { name: "Profession", image: "/images/novak/profession.jpeg", description: "Try on different career looks" },
  { name: "Superheroes", image: "/images/novak/heroes.jpeg", description: "Become your favorite superhero" },
  { name: "Games", image: "/images/novak/games.jpeg", description: "Enter the world of your favorite video games" },
  { name: "History", image: "/images/novak/history.jpeg", description: "Travel back in time with historical themes" },
  { name: "Drag", image: "/images/novak/drag.jpeg", description: "Unleash your inner drag queen or king" },
  { name: "Sexy", image: "/images/novak/sexy.jpeg", description: "Spice up your photos with alluring themes" },
  // { name: "OnlyFans", image: "/images/onlyfans.jpeg", description: "Create enticing content for your fans" },
  // { name: "YearBook", image: "/images/yearbook.jpeg", description: "Relive your school days with a twist" },
  // { name: "Maternity", image: "/images/maternity.jpeg", description: "Celebrate the journey of motherhood" },
  // { name: "Dating", image: "/images/dating.jpeg", description: "Create the perfect dating profile pictures" },
]);

// Pricing data
const pricingPeriod = ref('monthly');
const pricingPeriodOptions = ref([
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly', value: 'yearly' },
]);

const pricingPlans = ref([
  {
    name: "Basic",
    monthlyPrice: 19,
    yearlyPrice: 9,
    features: [
      "100 AI photos per month",
      "10 photo packs",
      "Standard support",
    ],
  },
  {
    name: "Pro",
    monthlyPrice: 39,
    yearlyPrice: 19,
    features: [
      "Unlimited AI photos",
      "All photo packs",
      "Priority support",
      "Advanced editing tools",
    ],
  },
]);
</script>


