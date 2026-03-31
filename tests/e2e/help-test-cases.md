# Help Center & Search - Detailed Test Cases

## 1. Help Center Navigation Tests (10 cases)

### TC001: Access Help Center from Homepage
- **Objective**: Verify users can access help center from homepage
- **Precondition**: User is on homepage
- **Steps**:
  1. Navigate to homepage
  2. Locate "帮助中心" link
  3. Click the link
- **Expected Result**: Navigate to help center page with URL containing "/help"

### TC002: Help Center Header Verification
- **Objective**: Verify help center header displays correctly
- **Precondition**: User is on help center page
- **Steps**:
  1. Navigate to help center
  2. Check header elements
- **Expected Result**: Header contains logo, navigation menu, and search bar

### TC003: Help Center Footer Links
- **Objective**: Verify footer links in help center
- **Precondition**: User is on help center page
- **Steps**:
  1. Scroll to bottom of help center page
  2. Verify all footer links are present
- **Expected Result**: Footer contains Privacy Policy, Terms of Service, Contact links

### TC004: Help Category Display
- **Objective**: Verify help categories are displayed
- **Precondition**: User is on help center page
- **Steps**:
  1. Navigate to help center
  2. Count number of visible categories
- **Expected Result**: At least 3 help categories are displayed

### TC005: Navigate to Help Category
- **Objective**: Verify user can navigate to specific category
- **Precondition**: User is on help center page
- **Steps**:
  1. Click on a category link
  2. Verify navigation
- **Expected Result**: Navigate to category-specific page

### TC006: Back Navigation from Category
- **Objective**: Verify back navigation from category page
- **Precondition**: User is on category page
- **Steps**:
  1. Click back button or "返回" link
  2. Verify navigation
- **Expected Result**: Return to previous page (help center main page)

### TC007: Help Article Link Click
- **Objective**: Verify clicking article link displays content
- **Precondition**: User is on category page
- **Steps**:
  1. Click on an article link
  2. Verify article loads
- **Expected Result**: Article content is displayed

### TC008: Breadcrumb Navigation
- **Objective**: Verify breadcrumb navigation works
- **Precondition**: User is on article page
- **Steps**:
  1. Click on any breadcrumb link
  2. Verify navigation
- **Expected Result**: Navigate to corresponding level in hierarchy

### TC009: Contact Support Link
- **Objective**: Verify contact support functionality
- **Precondition**: User is on help center page
- **Steps**:
  1. Click "联系客服" link
  2. Verify support page loads
- **Expected Result**: Support contact page is displayed

### TC010: Print Article Function
- **Objective**: Verify print functionality for articles
- **Precondition**: User is viewing an article
- **Steps**:
  1. Click print button
  2. Verify print dialog appears
- **Expected Result**: Print dialog opens with article content

## 2. Search Functionality Tests (20 cases)

### TC011: Search Bar Visibility
- **Objective**: Verify search bar is visible on all pages
- **Precondition**: User is on any page
- **Steps**:
  1. Navigate to any page
  2. Locate search bar
- **Expected Result**: Search bar is visible and accessible

### TC012: Basic Search Execution
- **Objective**: Verify basic search functionality
- **Precondition**: User is on any page with search bar
- **Steps**:
  1. Enter search term "打卡"
  2. Press Enter or click search button
- **Expected Result**: Search results page loads with results

### TC013: Search Result Count Display
- **Objective**: Verify search result count is displayed
- **Precondition**: User performed a search with results
- **Steps**:
  1. Perform a search
  2. Check for result count display
- **Expected Result**: Number of results is displayed

### TC014: Empty Search Results
- **Objective**: Verify handling of no results
- **Precondition**: User enters search term with no matches
- **Steps**:
  1. Enter search term with no results
  2. Execute search
- **Expected Result**: Message "未找到相关结果" is displayed

### TC015: Search Suggestion Display
- **Objective**: Verify search suggestions appear
- **Precondition**: User starts typing in search bar
- **Steps**:
  1. Focus on search bar
  2. Type "心情"
  3. Observe suggestions
- **Expected Result**: Relevant suggestions appear below search bar

### TC016: Click Search Suggestion
- **Objective**: Verify clicking suggestion executes search
- **Precondition**: Suggestions are displayed
- **Steps**:
  1. Click on a suggestion
  2. Observe page behavior
- **Expected Result**: Executes search for clicked suggestion

### TC017: Advanced Search Options
- **Objective**: Verify advanced search options
- **Precondition**: User is on search results page
- **Steps**:
  1. Click "高级搜索" button
  2. Verify options appear
- **Expected Result**: Advanced search filters become visible

### TC018: Filter by Date Range
- **Objective**: Verify date range filtering
- **Precondition**: User is on search results page
- **Steps**:
  1. Open advanced search
  2. Set date range
  3. Apply filter
- **Expected Result**: Results filtered by date range

### TC019: Filter by Content Type
- **Objective**: Verify content type filtering
- **Precondition**: User is on search results page
- **Steps**:
  1. Open advanced search
  2. Select content type filter
  3. Apply filter
- **Expected Result**: Results filtered by selected content type

### TC020: Search Result Highlighting
- **Objective**: Verify search terms are highlighted
- **Precondition**: User performed a search
- **Steps**:
  1. Review search results
  2. Check for highlighted terms
- **Expected Result**: Search terms are highlighted in results

### TC021: Search Result Pagination
- **Objective**: Verify pagination for many results
- **Precondition**: Search returns more results than per-page limit
- **Steps**:
  1. Perform search with many results
  2. Check for pagination controls
- **Expected Result**: Pagination controls are visible and functional

### TC022: Next Page Navigation
- **Objective**: Verify next page functionality
- **Precondition**: Pagination controls are visible
- **Steps**:
  1. Click "下一页" button
  2. Verify page change
- **Expected Result**: Navigate to next page of results

### TC023: Previous Page Navigation
- **Objective**: Verify previous page functionality
- **Precondition**: User is on page 2 or later
- **Steps**:
  1. Click "上一页" button
  2. Verify page change
- **Expected Result**: Navigate to previous page of results

### TC024: Page Number Jump
- **Objective**: Verify direct page navigation
- **Precondition**: Pagination controls are visible
- **Steps**:
  1. Click on specific page number
  2. Verify navigation
- **Expected Result**: Navigate directly to selected page

### TC025: Sort by Relevance
- **Objective**: Verify relevance sorting
- **Precondition**: User is on search results page
- **Steps**:
  1. Select "相关性" sort option
  2. Verify results reorder
- **Expected Result**: Results sorted by relevance to search term

### TC026: Sort by Date
- **Objective**: Verify date sorting
- **Precondition**: User is on search results page
- **Steps**:
  1. Select "日期" sort option
  2. Verify results reorder
- **Expected Result**: Results sorted by date (newest first)

### TC027: Search History Display
- **Objective**: Verify search history functionality
- **Precondition**: User has performed searches before
- **Steps**:
  1. Click on search bar
  2. Check for history items
- **Expected Result**: Previous search terms are displayed

### TC028: Click Search History Item
- **Objective**: Verify clicking history re-executes search
- **Precondition**: Search history is displayed
- **Steps**:
  1. Click on a history item
  2. Verify search executes
- **Expected Result**: Re-executes the clicked search term

### TC029: Clear Search History
- **Objective**: Verify clearing search history
- **Precondition**: Search history exists
- **Steps**:
  1. Find "清除历史" button
  2. Click to clear history
- **Expected Result**: Search history is cleared

### TC030: Search Result Metadata
- **Objective**: Verify search result metadata display
- **Precondition**: User has search results
- **Steps**:
  1. Examine search results
  2. Check for metadata (date, type, etc.)
- **Expected Result**: Each result shows title, description, URL, and metadata

## 3. Help Article Content Tests (10 cases)

### TC031: Article Title Display
- **Objective**: Verify article title displays correctly
- **Precondition**: User is viewing a help article
- **Steps**:
  1. Load an article
  2. Check title display
- **Expected Result**: Article title is clearly visible at top

### TC032: Article Content Formatting
- **Objective**: Verify content formatting is preserved
- **Precondition**: User is viewing an article with formatted content
- **Steps**:
  1. Review article content
  2. Check formatting elements
- **Expected Result**: Headers, lists, bold, italic formatting preserved

### TC033: Article Images Loading
- **Objective**: Verify embedded images load
- **Precondition**: Article contains images
- **Steps**:
  1. Load article with images
  2. Check image loading
- **Expected Result**: All images load and display properly

### TC034: Article Links Functionality
- **Objective**: Verify internal links work
- **Precondition**: Article contains internal links
- **Steps**:
  1. Click on internal link in article
  2. Verify navigation
- **Expected Result**: Navigates to linked content within help center

### TC035: External Links Warning
- **Objective**: Verify warning for external links
- **Precondition**: Article contains external links
- **Steps**:
  1. Hover over external link
  2. Check for warning indicator
- **Expected Result**: External link has appropriate warning icon/text

### TC036: Article Rating Function
- **Objective**: Verify article rating functionality
- **Precondition**: Article has rating controls
- **Steps**:
  1. Click thumbs up/down button
  2. Verify rating is recorded
- **Expected Result**: Rating is submitted and acknowledged

### TC037: Article Sharing Options
- **Objective**: Verify sharing functionality
- **Precondition**: Article has sharing options
- **Steps**:
  1. Click share button
  2. Select sharing method
- **Expected Result**: Sharing dialog opens with selected method

### TC038: Table of Contents Navigation
- **Objective**: Verify table of contents works
- **Precondition**: Article has table of contents
- **Steps**:
  1. Click on TOC entry
  2. Verify scroll to section
- **Expected Result**: Page scrolls to selected section

### TC039: Related Articles Display
- **Objective**: Verify related articles show
- **Precondition**: User is viewing an article
- **Steps**:
  1. Scroll to bottom of article
  2. Check for related articles
- **Expected Result**: Related articles are displayed

### TC040: Feedback Form Availability
- **Objective**: Verify feedback option exists
- **Precondition**: User is viewing an article
- **Steps**:
  1. Look for feedback option
  2. Click to open form
- **Expected Result**: Feedback form opens and is functional

## 4. Responsive Design Tests (10 cases)

### TC041: Mobile Help Center Layout
- **Objective**: Verify help center layout on mobile
- **Precondition**: Using mobile device or emulator
- **Steps**:
  1. Access help center on mobile
  2. Check layout elements
- **Expected Result**: Responsive layout with collapsible menus

### TC042: Mobile Search Bar
- **Objective**: Verify search bar on mobile
- **Precondition**: Using mobile device
- **Steps**:
  1. Access any page on mobile
  2. Locate search bar
- **Expected Result**: Search bar is accessible and usable

### TC043: Tablet Category Layout
- **Objective**: Verify category layout on tablet
- **Precondition**: Using tablet device
- **Steps**:
  1. Navigate to category page on tablet
  2. Check layout
- **Expected Result**: Optimized layout for intermediate screen size

### TC044: Mobile Article Navigation
- **Objective**: Verify article navigation on mobile
- **Precondition**: Viewing article on mobile
- **Steps**:
  1. Navigate through article on mobile
  2. Check for usability
- **Expected Result**: Easy navigation with appropriate touch targets

### TC045: Mobile Search Results
- **Objective**: Verify search results on mobile
- **Precondition**: Performing search on mobile
- **Steps**:
  1. Execute search on mobile
  2. Review results layout
- **Expected Result**: Results properly formatted for mobile

### TC046: Responsive Table of Contents
- **Objective**: Verify TOC responsiveness
- **Precondition**: Article with TOC on various devices
- **Steps**:
  1. View TOC on different screen sizes
  2. Check functionality
- **Expected Result**: TOC adapts to screen size appropriately

### TC047: Mobile Filter Options
- **Objective**: Verify filters on mobile
- **Precondition**: On search results page on mobile
- **Steps**:
  1. Try to access filters on mobile
  2. Check usability
- **Expected Result**: Filters accessible via mobile-friendly interface

### TC048: Touch-Friendly Navigation
- **Objective**: Verify touch targets are adequate
- **Precondition**: Using touch device
- **Steps**:
  1. Navigate using touch
  2. Check ease of use
- **Expected Result**: All interactive elements have adequate touch targets

### TC049: Orientation Change Handling
- **Objective**: Verify behavior during orientation change
- **Precondition**: Using mobile/tablet device
- **Steps**:
  1. Rotate device while on help page
  2. Check layout adjustment
- **Expected Result**: Layout adjusts smoothly to new orientation

### TC050: Mobile Search Suggestions
- **Objective**: Verify search suggestions on mobile
- **Precondition**: Using mobile device with search bar
- **Steps**:
  1. Start typing in search on mobile
  2. Check suggestions
- **Expected Result**: Suggestions display properly on mobile screen

## 5. Accessibility Tests (10 cases)

### TC051: Keyboard Navigation Through Categories
- **Objective**: Verify keyboard navigation in help center
- **Precondition**: User relies on keyboard navigation
- **Steps**:
  1. Use Tab key to navigate through categories
  2. Verify focus indicators
- **Expected Result**: All interactive elements reachable via keyboard

### TC052: Screen Reader Compatibility
- **Objective**: Verify screen reader compatibility
- **Precondition**: Screen reader is active
- **Steps**:
  1. Navigate help center with screen reader
  2. Verify content announcement
- **Expected Result**: All content properly announced by screen reader

### TC053: Alt Text for Images
- **Objective**: Verify alt text on help article images
- **Precondition**: Article contains images
- **Steps**:
  1. Inspect images in article
  2. Check for descriptive alt attributes
- **Expected Result**: All images have meaningful alt text

### TC054: ARIA Labels for Search
- **Objective**: Verify ARIA labels on search elements
- **Precondition**: On search-enabled page
- **Steps**:
  1. Inspect search elements
  2. Check for ARIA attributes
- **Expected Result**: Search elements have appropriate ARIA labels

### TC055: Focus Management During Search
- **Objective**: Verify focus behavior during search
- **Precondition**: User initiates search
- **Steps**:
  1. Start typing in search
  2. Observe focus behavior
- **Expected Result**: Focus remains predictable and logical

### TC056: High Contrast Mode Compatibility
- **Objective**: Verify compatibility with high contrast
- **Precondition**: High contrast mode enabled
- **Steps**:
  1. Access help center in high contrast mode
  2. Check readability
- **Expected Result**: Content remains readable in high contrast

### TC057: Heading Structure
- **Objective**: Verify proper heading hierarchy
- **Precondition**: Viewing help article
- **Steps**:
  1. Inspect heading elements
  2. Check hierarchical structure
- **Expected Result**: Proper H1, H2, H3 hierarchy maintained

### TC058: Link Descriptive Text
- **Objective**: Verify links have descriptive text
- **Precondition**: Help center with various links
- **Steps**:
  1. Review all links in help center
  2. Check link text descriptiveness
- **Expected Result**: Links have text that describes their destination

### TC059: Color Contrast Compliance
- **Objective**: Verify sufficient color contrast
- **Precondition**: Help center page loaded
- **Steps**:
  1. Check text against background colors
  2. Verify contrast ratios
- **Expected Result**: All text meets WCAG contrast requirements

### TC060: Form Input Labels
- **Objective**: Verify search form has proper labels
- **Precondition**: Search form is visible
- **Steps**:
  1. Inspect search input field
  2. Check for associated label
- **Expected Result**: Search input has visible, associated label

## 6. Performance Tests (5 cases)

### TC061: Help Center Load Time
- **Objective**: Verify acceptable load time for help center
- **Precondition**: Normal network conditions
- **Steps**:
  1. Navigate to help center
  2. Measure page load time
- **Expected Result**: Page loads within 3 seconds

### TC062: Search Response Time
- **Objective**: Verify quick search response
- **Precondition**: Search is functional
- **Steps**:
  1. Enter search term
  2. Measure time to results
- **Expected Result**: Results returned within 2 seconds

### TC063: Article Load Time
- **Objective**: Verify individual article load time
- **Precondition**: Available articles to load
- **Steps**:
  1. Click on an article link
  2. Measure load time
- **Expected Result**: Article loads within 2 seconds

### TC064: Search Suggestion Speed
- **Objective**: Verify fast search suggestions
- **Precondition**: Typing in search bar
- **Steps**:
  1. Type in search bar
  2. Measure time to suggestions
- **Expected Result**: Suggestions appear within 500ms

### TC065: Image Loading Performance
- **Objective**: Verify efficient image loading in articles
- **Precondition**: Article with images
- **Steps**:
  1. Load article with images
  2. Measure image loading time
- **Expected Result**: Images load within 3 seconds without blocking text