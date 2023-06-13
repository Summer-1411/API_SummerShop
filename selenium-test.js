const { Builder, By, until } = require('selenium-webdriver');
const fetch = require('node-fetch');
const createLog = require('./logger')
const loggerStart = createLog("Start")
const testCase = createLog("Test case")
const loggerEnd = createLog("End")
const loggerSuccess = createLog("SUCCESS")
const loggerError = createLog("FAIL")
let accessToken;
const accounts = [];
for (let i = 0; i < 100; i++) {
    accounts.push({
        username: `TestUserName${i}`,
        email: `emailTest${i}@gmail.com`,
        password: "123456"
    })
}
console.log({ accounts });
(async function example() {
    // Khởi tạo trình duyệt từ xa sử dụng Source Labs
    const driver = await new Builder()
        .usingServer('https://oauth-levantung14112002-9c876:1236c517-a2fd-4fba-87c4-623ea1daf8b5@ondemand.us-west-1.saucelabs.com:443/wd/hub')
        .withCapabilities({
            platformName: 'Windows 10',
            browserName: 'chrome',
            version: 'latest',
            user: 'oauth-levantung14112002-9c876',
            accessKey: '1236c517-a2fd-4fba-87c4-623ea1daf8b5',
        })
        .build();

    try {
        loggerStart("Testing API register");
        testCase("1. Đầy đủ thông tin đăng ký")
        const registerResponse = await fetch('http://localhost:6868/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'John Doe', email: 'john.doe@example.com', password: "123456" }),
        })
        const registerData = await registerResponse.json();
        for (const account of accounts) {
            const register = async () => {
                testCase("1. Acount " + index)
                const registerResponse = await fetch('http://localhost:6868/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: account.username, email: account.email, password: account.password }),
                })
                const registerData = await registerResponse.json();
                if (registerData.success) {
                    loggerSuccess('Register API test passed!' + index);
                } else {
                    loggerError(registerData.message);
                }
            }
            register()
        }
        


        testCase("2. Thiếu thông tin đăng ký")
        const registerResponse2 = await fetch('http://localhost:6868/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'john.doe@example.com', password: "123456" }),
        })
        const registerData2 = await registerResponse2.json();

        if (registerData2.success) {
            loggerSuccess('Register API test passed!');
        } else {
            loggerError(registerData2.message);
        }

        loggerStart("Testing API login");
        testCase("3. Sai thông tin đăng nhập")
        const loginResponse = await fetch('http://localhost:6868/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'john.doe@example.com', password: "1234567" }),
        })
        const loginData = await loginResponse.json();

        if (loginData.success) {
            loggerSuccess('login API test passed!');
        } else {
            loggerError(loginData.message);
        }
        testCase("4. Thiếu thông tin đăng nhập")
        const loginResponse1 = await fetch('http://localhost:6868/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'john.doe@example.com' }),
        })
        const loginData1 = await loginResponse1.json();

        if (loginData1.success) {
            loggerSuccess('login API test passed!');

        } else {
            loggerError(loginData1.message);
        }

        testCase("5. Thông tin đăng nhập chính xác")
        const loginResponse2 = await fetch('http://localhost:6868/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin1234@gmail.com', password: "123456" }),
        })
        const loginData2 = await loginResponse2.json();
        console.log({ loginData2 });
        if (loginData2.success) {
            loggerSuccess('login API test passed!');
            accessToken = loginData2.accessToken
            //console.log({accessToken});
        } else {
            loggerError(loginData2.message);
        }
        loggerStart("Testing API update user");
        testCase("6. Không có access token");
        const updateResponse = await fetch('http://localhost:6868/api/user/update/30', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'New UserName', avatar: "New AVT" }),
        })
        const updateData = await updateResponse.json();

        if (updateData.success) {
            loggerSuccess('update profile API test passed!');
        } else {
            loggerError(updateData.message);
        }
        testCase("7. Access Token không hợp lệ");
        const updateResponse1 = await fetch('http://localhost:6868/api/user/update/30', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${accessToken}s` },
            body: JSON.stringify({ username: 'New UserName 1', avatar: "New AVT 1" }),
        })
        const updateData1 = await updateResponse1.json();

        if (updateData1.success) {
            loggerSuccess('update profile API test passed!');
        } else {
            loggerError(updateData1.message);
        }
        testCase("8. Cập nhật thông tin người dùng khác");
        const updateResponse2 = await fetch('http://localhost:6868/api/user/update/31', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${accessToken}` },
            body: JSON.stringify({ username: 'New UserName 2', avatar: "New AVT 2" }),
        })
        const updateData2 = await updateResponse2.json();

        if (updateData2.success) {
            loggerSuccess('update profile API test passed!');
        } else {
            loggerError(updateData2.message);
        }

        testCase("9. Cập nhật thông tin chính xác");
        const updateResponse3 = await fetch('http://localhost:6868/api/user/update/29', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${accessToken}` },
            body: JSON.stringify({ username: 'Username success', gender: 1 }),
        })
        const updateData3 = await updateResponse3.json();

        if (updateData3.success) {
            loggerSuccess('update profile API test passed!');
        } else {
            loggerError(updateData3.message);
        }
        loggerStart("Testing API products");
        testCase("10. Lấy danh sách sản phẩm")
        const productsResponse = await fetch('http://localhost:6868/api/product');
        const productsData = await productsResponse.json();
        if (productsData.success) {
            loggerSuccess('Get all product API test passed!');
        } else {
            loggerError(productsData.message);
        }
        testCase("11. Lấy chi tiết sản phẩm")
        const productResponse = await fetch(`http://localhost:6868/api/product?id=${35}`);
        const productData = await productResponse.json();
        if (productData.success) {
            loggerSuccess('Get product detail API test passed!');
        } else {
            loggerError(productsData.message);
        }

        // Gọi API để tạo người dùng mới
        // const createUserResponse = await fetch('http://localhost:3000/api/v1/create-user', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ name: 'John Doe', email: 'john.doe@example.com' }),
        // });
        // const createUserResult = await createUserResponse.json();

        // // Kiểm tra kết quả
        // if (createUserResult.success) {
        //     console.log('Create user API test passed!');
        // } else {
        //     console.log('Create user API test failed!');
        // }

        // // Gọi API để cập nhật thông tin người dùng
        // const updateUserResponse = await fetch('http://localhost:3000/api/v1/update-user', {
        //     method: 'PUT',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ id: '123', name: 'Updated User' }),
        // });
        // const updateUserResult = await updateUserResponse.json();

        // // Kiểm tra kết quả
        // if (updateUserResult.success) {
        //     console.log('Update user API test passed!');
        // } else {
        //     console.log('Update user API test failed!');
        // }

        // // Gọi API để xóa người dùng
        // const deleteUserResponse = await fetch('http://localhost:3000/api/v1/delete-user/123', {
        //     method: 'DELETE',
        // });
        // const deleteUserResult = await deleteUserResponse.json();

        // // Kiểm tra kết quả
        // if (deleteUserResult.success) {
        //     console.log('Delete user API test passed!');
        // } else {
        //     console.log('Delete user API test failed!');
        // }

        // // Gọi API để lấy danh sách tất cả các tệp
        // const allFilesResponse = await fetch('http://localhost:3000/api/v1/all-file');
        // const allFilesData = await allFilesResponse.json();

        // // Kiểm tra kết quả
        // if (Array.isArray(allFilesData) && allFilesData.length > 0) {
        //     console.log('Get all files API test passed!');
        // } else {
        //     console.log('Get all files API test failed!');
        // }

        // // Gọi API để tải lên một tệp
        // const uploadResponse = await fetch('http://localhost:3000/api/v1/upload', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ filename: 'example.jpg', data: 'base64encodeddata' }),
        // });
        // const uploadResult = await uploadResponse.json();

        // // Kiểm tra kết quả
        // if (uploadResult.success) {
        //     console.log('Upload file API test passed!');
        // } else {
        //     console.log('Upload file API test failed!');
        // }

        loggerEnd("Testing")
    } finally {
        // Đóng trình duyệt
        await driver.quit();
    }
})();
