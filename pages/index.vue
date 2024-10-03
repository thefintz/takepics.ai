<template>
  <div class="flex flex-col items-center justify-center">
    <!-- Section 1: Quick Explanation -->
    <section class="w-full h-screen py-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center">
      <h1 class="text-4xl font-bold mb-4">Create AI Photos for You and Your Friends</h1>
      <p class="text-xl mb-8">Transform your selfies into stunning AI-generated portraits</p>
      <Button label="Create AI Photos" icon="pi pi-user" @click="navigateToLogin" class="p-button-lg" />
    </section>

    <section class="container mx-auto py-16">
      <div class="flex flex-col md:flex-row items-center justify-center">
        <div class="text-center">
          <h3 class="text-2xl font-bold mb-4">User Photos</h3>
          <div class="flex justify-center mb-0">
            <div class="grid grid-cols-2 gap-4 w-fit">
              <NuxtImg v-for="i in 4"
                :key="i"
                :src="`/images/sample-${i}.png`"
                alt="Sample photo"
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
          <Carousel :value="aiImages" :numVisible="1" :numScroll="1" :autoplayInterval="3000" :circular="true" class="w-full max-w-md">
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
    <section class="bg-gray-800 w-full py-16">
      <div class="container mx-auto">
        <h2 class="text-3xl font-bold text-center text-white mb-8">What Our Users Say</h2>
        <!-- Desktop view: columns -->
        <div class="hidden md:grid grid-cols-3 gap-6">
          <div v-for="testimonial in testimonials" :key="testimonial.name" class="bg-gray-600 rounded-lg p-6 shadow-lg">
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
  <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    <div v-for="image in aiImages" :key="image.alt" class="aspect-[2/3]">
      <NuxtImg :src="image.itemImageSrc" :alt="image.alt" class="w-full h-full object-cover rounded-lg" />
    </div>
  </div>
</section>

    <!-- Section 5: Login Button -->
    <section class="w-full py-16 bg-gray-800 text-white text-center">
      <h2 class="text-3xl font-bold mb-4">Ready to Transform Your Photos?</h2>
      <Button label="Login Now" icon="pi pi-sign-in" @click="navigateToLogin" class="p-button-lg p-button-outlined" />
    </section>

    <!-- Section 6: FAQ -->
    <section class="container mx-auto py-16">
      <h2 class="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
      <Accordion :multiple="true">
        <AccordionTab v-for="faq in faqs" :key="faq.question" :header="faq.question">
          <p>{{ faq.answer }}</p>
        </AccordionTab>
      </Accordion>
    </section>

    <!-- Section 7: Comparison with Competitors -->
    <section class="w-full py-16 bg-gray-700">
      <div class="container mx-auto">
        <h2 class="text-3xl font-bold text-center mb-8">Your Best AI Photo Creator</h2>
        <DataTable :value="comparisonData" responsiveLayout="scroll">
          <Column field="feature" header="Feature"></Column>
          <Column field="us" header="Our Service"></Column>
          <Column field="competitor1" header="Competitor 1"></Column>
          <Column field="competitor2" header="Competitor 2"></Column>
        </DataTable>
      </div>
    </section>

    <!-- Section 8: Photo Packs -->
    <section class="container mx-auto py-16">
      <h2 class="text-3xl font-bold text-center mb-8">Explore Our Photo Packs</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div v-for="pack in photoPacks" :key="pack.name" class="card">
          <div class="aspect-[2/3]">
            <NuxtImg :src="pack.image" :alt="pack.name" class="w-full object-cover rounded-t-lg" />
          </div>
          <div class="p-4">
            <h3 class="text-xl font-bold mb-2">{{ pack.name }}</h3>
            <p>{{ pack.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 9: Pricing Table -->
    <section class="w-full py-16 bg-gray-800">
      <div class="container mx-auto">
        <h2 class="text-3xl font-bold text-center mb-8">Choose Your Plan</h2>
        <div class="flex justify-center mb-8">
          <SelectButton v-model="pricingPeriod" :options="pricingPeriodOptions" optionLabel="label" />
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div v-for="plan in pricingPlans" :key="plan.name" class="card p-6">
            <h3 class="text-2xl font-bold mb-4">{{ plan.name }}</h3>
            <p class="text-4xl font-bold mb-4">${{ pricingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice }}<span class="text-lg font-normal">/{{ pricingPeriod === 'monthly' ? 'mo' : 'yr' }}</span></p>
            <ul class="mb-6">
              <li v-for="feature in plan.features" :key="feature" class="flex items-center mb-2">
                <i class="pi pi-check-circle mr-2 text-green-500"></i>
                {{ feature }}
              </li>
            </ul>
            <Button :label="`Choose ${plan.name}`" class="p-button-lg w-full" :class="plan.name === 'Pro' ? 'p-button-outlined' : ''" />
          </div>
        </div>
      </div>
    </section>

    <!-- Section 10: Final CTA -->
    <section class="w-full py-16 bg-gradient-to-r from-purple-600 to-blue-500 text-white text-center">
      <h2 class="text-3xl font-bold mb-4">Create Your AI Model and Photos Now</h2>
      <p class="text-xl mb-8">Join thousands of satisfied users and transform your photos today!</p>
      <Button label="Get Started" icon="pi pi-image" @click="navigateToLogin" class="p-button-lg p-button-outlined p-button-white" />
    </section>

    <!-- Section 11: Footer -->
    <footer class="w-full bg-gray-800 text-white py-8">
      <div class="container mx-auto flex flex-wrap justify-between">
        <div class="w-full md:w-1/4 mb-6 md:mb-0">
          <h4 class="text-lg font-bold mb-4">About Us</h4>
          <p>We create stunning AI-generated photos for you and your friends.</p>
        </div>
        <div class="w-full md:w-1/4 mb-6 md:mb-0">
          <h4 class="text-lg font-bold mb-4">Quick Links</h4>
          <ul>
            <li><a href="#" class="hover:text-gray-300">Home</a></li>
            <li><a href="#" class="hover:text-gray-300">Pricing</a></li>
            <li><a href="#" class="hover:text-gray-300">FAQ</a></li>
            <li><a href="#" class="hover:text-gray-300">Contact</a></li>
          </ul>
        </div>
        <div class="w-full md:w-1/4 mb-6 md:mb-0">
          <h4 class="text-lg font-bold mb-4">Follow Us</h4>
          <div class="flex space-x-4">
            <a href="#" class="hover:text-gray-300"><i class="pi pi-facebook"></i></a>
            <a href="#" class="hover:text-gray-300"><i class="pi pi-twitter"></i></a>
            <a href="#" class="hover:text-gray-300"><i class="pi pi-instagram"></i></a>
          </div>
        </div>
        <div class="w-full md:w-1/4">
          <h4 class="text-lg font-bold mb-4">Newsletter</h4>
          <InputText placeholder="Enter your email" class="w-full mb-2" />
          <Button label="Subscribe" class="w-full" />
        </div>
      </div>
      <div class="mt-8 text-center">
        <p>&copy; 2023 AI Photo Generation. All rights reserved.</p>
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
  router.push('/login');
};

// Testimonials data
const testimonials = ref([
  { 
    quote: "This AI photo generator is amazing! I've never looked so good!",
    name: "John Doe",
    avatar: "/images/tech-vanguard.png",
    company: "Vanguard Tech",
    rating: 5,
    verified: true
  },
  { 
    quote: "I use these AI photos for all my social media profiles now. Incredible results!",
    name: "Jane Smith",
    avatar: "/images/aurora.png",
    company: "Influencer",
    rating: 5,
    verified: true
  },
  { 
    quote: "The variety of styles and themes is impressive. Highly recommended!",
    name: "Mike Johnson",
    avatar: "/images/creative-studios.png",
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

// AI-created images data
const aiImages = ref([
  { itemImageSrc: '/images/ai-image-1.png', alt: 'AI Image 1' },
  { itemImageSrc: '/images/ai-image-2.png', alt: 'AI Image 2' },
  { itemImageSrc: '/images/ai-image-3.png', alt: 'AI Image 3' },
  { itemImageSrc: '/images/ai-image-4.png', alt: 'AI Image 4' },
  { itemImageSrc: '/images/ai-image-5.png', alt: 'AI Image 5' },
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
  { question: "How does AI photo generation work?", answer: "Our AI uses advanced machine learning algorithms to analyze your photos and generate new, high-quality images based on various styles and themes." },
  { question: "Is my data safe?", answer: "Yes, we take data privacy very seriously. All uploaded photos are encrypted and deleted after processing." },
  { question: "How long does it take to generate AI photos?", answer: "Most AI photos are generated within minutes, but complex requests may take up to an hour." },
]);

// Comparison data
const comparisonData = ref([
  { feature: "AI Photo Quality", us: "Excellent", competitor1: "Good", competitor2: "Average" },
  { feature: "Number of Styles", us: "50+", competitor1: "30", competitor2: "20" },
  { feature: "Processing Time", us: "Fast", competitor1: "Medium", competitor2: "Slow" },
  { feature: "Customer Support", us: "24/7", competitor1: "Business Hours", competitor2: "Email Only" },
]);

// Photo packs data
const photoPacks = ref([
  { name: "Travel", image: "/images/travel.png", description: "Transform yourself into a globe-trotter" },
  { name: "Royalty", image: "/images/royalty.png", description: "Become a king or queen for a day" },
  { name: "Profession", image: "/images/profession.png", description: "Try on different career looks" },
  { name: "Heroes", image: "/images/heroes.png", description: "Become your favorite superhero" },
  { name: "Games", image: "/images/games.png", description: "Enter the world of your favorite video games" },
  { name: "History", image: "/images/history.png", description: "Travel back in time with historical themes" },
  { name: "Drag", image: "/images/drag.png", description: "Unleash your inner drag queen or king" },
  { name: "Sexy", image: "/images/sexy.png", description: "Spice up your photos with alluring themes" },
  // { name: "OnlyFans", image: "/images/onlyfans.png", description: "Create enticing content for your fans" },
  // { name: "YearBook", image: "/images/yearbook.png", description: "Relive your school days with a twist" },
  // { name: "Maternity", image: "/images/maternity.png", description: "Celebrate the journey of motherhood" },
  // { name: "Dating", image: "/images/dating.png", description: "Create the perfect dating profile pictures" },
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