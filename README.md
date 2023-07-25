##SILLAGE CARBONE

Sillage Carbone is a project launched as part of the 2022 Ocean Hackathon, to address the lack of tools to quantify the carbon footprint of product transportation, despite 90% of freight volumes being transported by sea.

This project involves the development of a website using React and a mobile Yuka-like application using React Native. Its primary objective is to empower users to easily search for information regarding the carbon footprint of product’s maritime journey. This can be done either through entering keywords in a search bar or by scanning the product’s barcode.

This approach enables consumers to make informed decisions based on the environmental impact of their purchases, promoting a more sustainable and eco-conscious lifestyle. This project’s approach aligns with the growing need for eco-responsible practices, as the transportation industry plays a significant role in global carbon emissions. Sillage Carbone recognizes the crucial role of maritime transportation in climate change and aims to fill the information gap by delivering accessible tools for quantifying carbon footprints. By bridging this knowledge gap, the project contributes to raising awareness and promoting a greener future.

The development of a React-based website ensures a seamless user experience, with intuitive navigation and efficient data retrieval. The React Native mobile application expands the project's accessibility, allowing users to access the carbon footprint database on-the-go and easily scan products while shopping.

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
