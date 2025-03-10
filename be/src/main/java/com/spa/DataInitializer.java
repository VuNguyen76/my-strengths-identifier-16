
package com.spa;

import com.spa.model.*;
import com.spa.repository.*;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ServiceCategoryRepository serviceCategoryRepository;
    
    @Autowired
    private ServiceRepository serviceRepository;
    
    @Autowired
    private SpecialistRepository specialistRepository;
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private BlogCategoryRepository blogCategoryRepository;
    
    @Autowired
    private BlogPostRepository blogPostRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @PostConstruct
    @Transactional
    public void initialize() {
        // Skip if data already exists
        if (userRepository.count() > 0) {
            return;
        }
        
        createUsers();
        createServiceCategories();
        createSpecialists();
        createBookings();
        createBlogCategories();
    }
    
    private void createUsers() {
        // Create admin user
        User admin = new User();
        admin.setUsername("admin@example.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setEmail("admin@example.com");
        admin.setFullName("Admin User");
        admin.setPhone("0123456789");
        admin.setRole(User.Role.ROLE_ADMIN);
        admin.setActive(true);
        userRepository.save(admin);
        
        // Create regular user
        User user = new User();
        user.setUsername("user@example.com");
        user.setPassword(passwordEncoder.encode("user123"));
        user.setEmail("user@example.com");
        user.setFullName("Regular User");
        user.setPhone("0987654321");
        user.setRole(User.Role.ROLE_CUSTOMER);
        user.setActive(true);
        userRepository.save(user);
        
        // Create staff user
        User staff = new User();
        staff.setUsername("staff@example.com");
        staff.setPassword(passwordEncoder.encode("staff123"));
        staff.setEmail("staff@example.com");
        staff.setFullName("Staff Member");
        staff.setPhone("0123456780");
        staff.setRole(User.Role.ROLE_STAFF);
        staff.setActive(true);
        userRepository.save(staff);
        
        System.out.println("Created users: admin@example.com/admin123, user@example.com/user123, staff@example.com/staff123");
    }
    
    private void createServiceCategories() {
        // Create service categories
        ServiceCategory facialCategory = new ServiceCategory();
        facialCategory.setName("Facial Treatments");
        facialCategory.setDescription("Rejuvenate your skin with our premium facial treatments");
        facialCategory.setImage("facial.jpg");
        serviceCategoryRepository.save(facialCategory);
        
        ServiceCategory massageCategory = new ServiceCategory();
        massageCategory.setName("Massage Therapies");
        massageCategory.setDescription("Relax and unwind with our therapeutic massage treatments");
        massageCategory.setImage("massage.jpg");
        serviceCategoryRepository.save(massageCategory);
        
        ServiceCategory bodyCategory = new ServiceCategory();
        bodyCategory.setName("Body Treatments");
        bodyCategory.setDescription("Full body wellness and beauty treatments");
        bodyCategory.setImage("body.jpg");
        serviceCategoryRepository.save(bodyCategory);
        
        // Create services
        createServices(facialCategory, massageCategory, bodyCategory);
    }
    
    private void createServices(ServiceCategory facialCategory, ServiceCategory massageCategory, ServiceCategory bodyCategory) {
        // Facial services
        Service basicFacial = new Service();
        basicFacial.setName("Basic Facial");
        basicFacial.setDescription("A gentle cleansing facial suitable for all skin types");
        basicFacial.setPrice(50.0);
        basicFacial.setDuration(30);
        basicFacial.setCategory(facialCategory);
        basicFacial.setActive(true);
        serviceRepository.save(basicFacial);
        
        Service deluxeFacial = new Service();
        deluxeFacial.setName("Deluxe Facial");
        deluxeFacial.setDescription("Advanced facial with anti-aging and deep cleansing benefits");
        deluxeFacial.setPrice(80.0);
        deluxeFacial.setDuration(60);
        deluxeFacial.setCategory(facialCategory);
        deluxeFacial.setActive(true);
        serviceRepository.save(deluxeFacial);
        
        // Massage services
        Service swedishMassage = new Service();
        swedishMassage.setName("Swedish Massage");
        swedishMassage.setDescription("Classic relaxation massage to reduce tension");
        swedishMassage.setPrice(70.0);
        swedishMassage.setDuration(60);
        swedishMassage.setCategory(massageCategory);
        swedishMassage.setActive(true);
        serviceRepository.save(swedishMassage);
        
        Service deepTissue = new Service();
        deepTissue.setName("Deep Tissue Massage");
        deepTissue.setDescription("Intense massage focusing on relieving chronic muscle tension");
        deepTissue.setPrice(90.0);
        deepTissue.setDuration(60);
        deepTissue.setCategory(massageCategory);
        deepTissue.setActive(true);
        serviceRepository.save(deepTissue);
        
        // Body services
        Service bodyWrap = new Service();
        bodyWrap.setName("Detox Body Wrap");
        bodyWrap.setDescription("Full body detoxifying treatment");
        bodyWrap.setPrice(120.0);
        bodyWrap.setDuration(90);
        bodyWrap.setCategory(bodyCategory);
        bodyWrap.setActive(true);
        serviceRepository.save(bodyWrap);
    }
    
    private void createSpecialists() {
        User staffUser = userRepository.findByUsername("staff@example.com")
                .orElseThrow(() -> new RuntimeException("Staff user not found"));
        
        Specialist specialist = new Specialist();
        specialist.setUser(staffUser);
        specialist.setRole("Senior Therapist");
        specialist.setExperience(5);
        specialist.setBio("Experienced massage therapist with focus on healing therapies");
        List<String> specialties = new ArrayList<>();
        specialties.add("Swedish Massage");
        specialties.add("Deep Tissue Massage");
        specialties.add("Facial Treatments");
        specialist.setSpecialties(specialties);
        specialist.setRating(4.8);
        
        List<String> availability = new ArrayList<>();
        availability.add("Monday: 9:00-17:00");
        availability.add("Tuesday: 9:00-17:00");
        availability.add("Wednesday: 9:00-17:00");
        availability.add("Thursday: 9:00-17:00");
        availability.add("Friday: 9:00-17:00");
        specialist.setAvailability(availability);
        
        specialistRepository.save(specialist);
        
        // Create additional specialists
        for (int i = 1; i <= 3; i++) {
            User specialistUser = new User();
            specialistUser.setUsername("specialist" + i + "@example.com");
            specialistUser.setPassword(passwordEncoder.encode("specialist123"));
            specialistUser.setEmail("specialist" + i + "@example.com");
            specialistUser.setFullName("Specialist " + i);
            specialistUser.setPhone("098765432" + i);
            specialistUser.setRole(User.Role.ROLE_STAFF);
            specialistUser.setActive(true);
            userRepository.save(specialistUser);
            
            Specialist newSpecialist = new Specialist();
            newSpecialist.setUser(specialistUser);
            newSpecialist.setRole("Therapist");
            newSpecialist.setExperience(2 + i);
            newSpecialist.setBio("Professional therapist with various skills");
            
            List<String> newSpecialties = new ArrayList<>();
            newSpecialties.add("Swedish Massage");
            newSpecialties.add("Facial Treatments");
            newSpecialist.setSpecialties(newSpecialties);
            newSpecialist.setRating(4.0 + (i * 0.2));
            
            List<String> newAvailability = new ArrayList<>();
            newAvailability.add("Monday: 9:00-17:00");
            newAvailability.add("Wednesday: 9:00-17:00");
            newAvailability.add("Friday: 9:00-17:00");
            newSpecialist.setAvailability(newAvailability);
            
            specialistRepository.save(newSpecialist);
        }
    }
    
    private void createBookings() {
        User customer = userRepository.findByUsername("user@example.com")
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        
        List<Service> services = serviceRepository.findAll();
        if (services.isEmpty()) {
            return;
        }
        
        List<Specialist> specialists = specialistRepository.findAll();
        if (specialists.isEmpty()) {
            return;
        }
        
        // Create some sample bookings
        Booking booking1 = new Booking();
        booking1.setCustomer(customer);
        booking1.setService(services.get(0));
        booking1.setSpecialist(specialists.get(0));
        booking1.setBookingDate(LocalDate.now().plusDays(1));
        booking1.setBookingTime(LocalTime.of(10, 0));
        booking1.setStatus(Booking.BookingStatus.CONFIRMED);
        booking1.setNote("First time trying this service");
        bookingRepository.save(booking1);
        
        Booking booking2 = new Booking();
        booking2.setCustomer(customer);
        booking2.setService(services.get(1));
        booking2.setSpecialist(specialists.get(0));
        booking2.setBookingDate(LocalDate.now().plusDays(7));
        booking2.setBookingTime(LocalTime.of(14, 0));
        booking2.setStatus(Booking.BookingStatus.PENDING);
        booking2.setNote("");
        bookingRepository.save(booking2);
    }
    
    private void createBlogCategories() {
        // Create blog categories
        BlogCategory skincare = new BlogCategory();
        skincare.setName("Skincare");
        skincare.setSlug("skincare");
        skincare.setDescription("Tips and advice for skin health and beauty");
        skincare.setActive(true);
        blogCategoryRepository.save(skincare);
        
        BlogCategory wellness = new BlogCategory();
        wellness.setName("Wellness");
        wellness.setSlug("wellness");
        wellness.setDescription("General wellness and self-care topics");
        wellness.setActive(true);
        blogCategoryRepository.save(wellness);
        
        BlogCategory news = new BlogCategory();
        news.setName("Spa News");
        news.setSlug("spa-news");
        news.setDescription("Latest updates and offerings from our spa");
        news.setActive(true);
        blogCategoryRepository.save(news);
        
        // Create blog posts
        createBlogPosts(skincare, wellness, news);
    }
    
    private void createBlogPosts(BlogCategory skincare, BlogCategory wellness, BlogCategory news) {
        User admin = userRepository.findByUsername("admin@example.com")
                .orElseThrow(() -> new RuntimeException("Admin user not found"));
        
        // Skincare blog post
        BlogPost skinPost = new BlogPost();
        skinPost.setTitle("The Benefits of Regular Facials");
        skinPost.setSlug("benefits-of-regular-facials");
        skinPost.setExcerpt("Discover how regular facial treatments can improve your skin health and appearance.");
        skinPost.setContent("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.");
        skinPost.setAuthor(admin.getFullName());
        skinPost.setCategory(skincare);
        skinPost.setActive(true);
        skinPost.setPublishedAt(java.time.LocalDateTime.now().minusDays(5));
        blogPostRepository.save(skinPost);
        
        // Wellness blog post
        BlogPost wellnessPost = new BlogPost();
        wellnessPost.setTitle("Massage Therapy for Stress Relief");
        wellnessPost.setSlug("massage-therapy-stress-relief");
        wellnessPost.setExcerpt("Learn how massage therapy can help reduce stress and improve your overall wellbeing.");
        wellnessPost.setContent("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.");
        wellnessPost.setAuthor(admin.getFullName());
        wellnessPost.setCategory(wellness);
        wellnessPost.setActive(true);
        wellnessPost.setPublishedAt(java.time.LocalDateTime.now().minusDays(10));
        blogPostRepository.save(wellnessPost);
        
        // News blog post
        BlogPost newsPost = new BlogPost();
        newsPost.setTitle("New Services Coming This Summer");
        newsPost.setSlug("new-services-summer");
        newsPost.setExcerpt("Exciting new spa treatments and services will be available starting this summer.");
        newsPost.setContent("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.");
        newsPost.setAuthor(admin.getFullName());
        newsPost.setCategory(news);
        newsPost.setActive(true);
        newsPost.setPublishedAt(java.time.LocalDateTime.now().minusDays(2));
        blogPostRepository.save(newsPost);
    }
}
