# Sillage Carbone web app

**Sillage Carbone** is a project launched to address the lack of tools to quantify the carbon footprint of product transportation.

This project involves the development of a website using React and a mobile Yuka-like application using React Native. Its primary objective is to empower users to easily search for information regarding the carbon footprint of product’s maritime journey. This can be done either through entering keywords in a search bar or by scanning the product’s barcode.

This approach enables consumers to make informed decisions based on the environmental impact of their purchases, promoting a more sustainable and eco-conscious lifestyle. This project’s approach aligns with the growing need for eco-responsible practices, as the transportation industry plays a significant role in global carbon emissions. Sillage Carbone recognizes the crucial role of maritime transportation in climate change and aims to fill the information gap by delivering accessible tools for quantifying carbon footprints. By bridging this knowledge gap, the project contributes to raising awareness and promoting a greener future.

The development of a React-based website ensures a seamless user experience, with intuitive navigation and efficient data retrieval. The React Native mobile application expands the project's accessibility, allowing users to access the carbon footprint database on-the-go and easily scan products while shopping.

<img src="/documentation/homepage.png" alt="Home page with search bar, little boat and articles on Sillage Carbon Project" width="300"> [Home page]
<img src="/documentation/productpage.png" alt="Product page with informations on a tuna fish can and a search bar" width="300"> [Product page]
<img src="/documentation/backofficepage.png" alt="Backoffice with side navigation bar, filter on users to display, user cards with email, creation date and button to delete the account" width="300"> [Backoffice page]

## Features

- **Search Product Shipping Carbon Footprint**: Enter products name a/o company to get information about their environmental impact.
- **Suggest Smilar Products**: Products of same type with different carbon footprint are suggested as alternatives.
- **Project Information**: Access information about the Sillage Carbone project, its goals, and methods.
- **Account Management**: Manage your account, preferences, and settings (needs to be implemented)
- **User-Friendly Interface**: Intuitive UI/UX design for seamless navigation and engagement.
- **Backoffice**: To manage users and products.

## Installation

1. Clone this repository to your local machine.

```bash
git clone https://github.com/Emlych/SillageCarbone
```

2. Navigate to the project directory.

```bash
 cd SillageCarbone
```

3. Install the required dependencies.

```bash
 npm install
```

4. Start the development server.

```bash
 npm start
```

## Technologies Used

- **React**: A JavaScript library for building native mobile applications.
- **react-router-dom**: A library for routing and navigation in React applications.
- **js-cookie**: A JavaScript library for handling cookies.
- **jest**: A JavaScript testing framework.
- **eslint**: A pluggable JavaScript linter for identifying and fixing code issues.
- **react-toastify**:A notification library for React applications.

- **Express**: A minimal web application framework for Node.js to handle server-side operations.
- **Mongoose**: An ODM (Object Data Modeling) library for MongoDB and Node.js.
- **MongoDB**: A NoSQL database system for storing and managing data.
- **Express-validator**: Middleware for validating and sanitizing input data in Express.

- **Cloudinary**: A cloud-based media management platform for image and video uploads.
- **Multer**: A middleware for handling multipart/form-data, commonly used for file uploads.
- **Cors**: A package to enable Cross-Origin Resource Sharing for handling API requests securely.
- **Crypto-js**: A library for cryptographic functions and utilities in JavaScript.
- **Express-jsdoc-swagger**: A tool for generating API documentation from JSDoc comments.

## Contribution

Contributions are welcome! To contribute to the Sillage Carbone web app:

1. Fork this repository.
2. Create a new branch: git checkout -b feature/your-feature-name
3. Make your changes and commit them: git commit -m 'Add some feature'
4. Push to the branch: git push origin feature/your-feature-name
5. Create a pull request.

```
SillageCarbone
├─ .git
├─ .gitignore
├─ README.md
├─ client
│  ├─ .gitignore
│  ├─ README.md
│  ├─ build
│  ├─ package.json
│  ├─ public
│  │  ├─ favicon.ico
│  │  ├─ index.html
│  ├─ src
│  │  ├─ App.css
│  │  ├─ App.tsx
│  │  ├─ assets
│  │  ├─ components
│  │  │  ├─ ArticleCard.tsx
│  │  │  ├─ Button.tsx
│  │  │  ├─ CardItem.tsx
│  │  │  ├─ DateInput.tsx
│  │  │  ├─ Dropdown.tsx
│  │  │  ├─ Input.tsx
│  │  │  ├─ Modal.tsx
│  │  │  ├─ SideNavigation.tsx
│  │  │  ├─ articlecard.css
│  │  │  ├─ button.css
│  │  │  ├─ carditem.css
│  │  │  ├─ dateinput.css
│  │  │  ├─ input.css
│  │  │  ├─ modal.css
│  │  │  └─ test
│  │  │     ├─ Button.test.tsx
│  │  │     └─ Dropdown.test.tsx
│  │  ├─ containers
│  │  │  ├─ Account
│  │  │  │  ├─ DeleteAccount.tsx
│  │  │  │  └─ ModifyAccount.tsx
│  │  │  ├─ BackOffice
│  │  │  │  ├─ ActionOnProduct.tsx
│  │  │  │  ├─ AdminDeleteAccount.tsx
│  │  │  │  ├─ BackofficeProductCard.tsx
│  │  │  │  ├─ Backoffice_components.tsx
│  │  │  │  ├─ Backoffice_navigation.tsx
│  │  │  │  ├─ CreateProduct.tsx
│  │  │  │  ├─ CreateUser.tsx
│  │  │  │  ├─ PageFooter.tsx
│  │  │  │  ├─ ProductDetail.tsx
│  │  │  │  ├─ ProductTags.tsx
│  │  │  │  ├─ Products.tsx
│  │  │  │  ├─ Users.tsx
│  │  │  │  ├─ pagefooter.css
│  │  │  │  └─ productTags.css
│  │  │  ├─ Header
│  │  │  │  ├─ CollapseNav.tsx
│  │  │  │  ├─ Header.tsx
│  │  │  │  ├─ HeaderBigScreen.tsx
│  │  │  │  └─ HeaderSmallScreen.tsx
│  │  │  ├─ Home
│  │  │  │  ├─ Caroussel.container.tsx
│  │  │  │  ├─ Caroussel.test.tsx
│  │  │  │  └─ CarousselCard.tsx
│  │  │  ├─ Modal
│  │  │  │  ├─ ForgottenPassword.tsx
│  │  │  │  ├─ Login.tsx
│  │  │  │  └─ Signup.tsx
│  │  │  ├─ Product
│  │  │  │  ├─ Caroussel.tsx
│  │  │  │  ├─ NoProduct_Card.tsx
│  │  │  │  └─ Product_Card.tsx
│  │  │  ├─ SearchProduct
│  │  │  │  ├─ Autocomplete.container.tsx
│  │  │  │  └─ SearchHero.container.tsx
│  │  │  └─ UserCard.tsx
│  │  ├─ dto
│  │  │  └─ ProductDto.tsx
│  │  ├─ index.css
│  │  ├─ index.tsx
│  │  ├─ pages
│  │  │  ├─ Account.page.tsx
│  │  │  ├─ Backoffice.page.tsx
│  │  │  ├─ ErrorProduct.tsx
│  │  │  ├─ Home.page.tsx
│  │  │  ├─ Product.page.tsx
│  │  │  └─ test
│  │  │     └─ Account.test.tsx
│  │  ├─ react-app-env.d.ts
│  │  ├─ setupTests.ts
│  │  ├─ styling
│  │  │  ├─ account.css
│  │  │  ├─ autocomplete.css
│  │  │  ├─ backoffice.css
│  │  │  ├─ backofficeProductCard.css
│  │  │  ├─ carouselHome.css
│  │  │  ├─ caroussel.css
│  │  │  ├─ header.css
│  │  │  ├─ home.css
│  │  │  ├─ productcard.css
│  │  │  ├─ searchhero.css
│  │  │  └─ usercard.css
│  │  ├─ tests
│  │  │  ├─ Autocomplete.test.tsx
│  │  │  ├─ CreateUser.test.tsx
│  │  │  ├─ Header.test.tsx
│  │  │  ├─ Login.test.tsx
│  │  │  ├─ Navigation.test.tsx
│  │  │  ├─ PageFooter.test.tsx
│  │  │  ├─ ProductCard.test.tsx
│  │  │  ├─ Products.test.tsx
│  │  │  ├─ Signup.test.tsx
│  │  │  ├─ Users.test.tsx
│  │  │  └─ format-data-utils.test.tsx
│  │  └─ utils
│  │     ├─ data-utils.ts
│  │     ├─ filter-utils.ts
│  │     └─ format-data-utils.ts
│  └─ tsconfig.json
├─ index.ts
├─ package.json
├─ server
│  ├─ __tests__
│  │  ├─ index.test.ts
│  │  ├─ mockData.ts
│  │  └─ test_db.ts
│  ├─ dto
│  │  ├─ productDto.ts
│  │  └─ userDto.ts
│  ├─ models
│  │  ├─ Harbour.ts
│  │  ├─ Product.ts
│  │  ├─ ProductType.ts
│  │  ├─ Transportation.ts
│  │  ├─ User.ts
│  │  └─ UserRole.ts
│  ├─ package.json
│  ├─ routes
│  │  ├─ product.ts
│  │  ├─ transportation.ts
│  │  └─ user.ts
│  └─ utils
│     └─ router-utils.ts
└─ tsconfig.json

```
