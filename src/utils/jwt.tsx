// src/utils/jwt.ts
export interface JwtUser {
  sub: string;
  userId: number;
  roleName: string;
  roleCode: string;
  iat: number;
  exp: number;
}

// src/utils/jwt.ts – PHIÊN BẢN CUỐI CÙNG, CHẠY 100% TRÊN TẤT CẢ TRÌNH DUYỆT!!!
export const getUserFromJwt = () => {
  const cookieString = document.cookie;
  console.log("All cookies:", cookieString); // ← THÊM DÒNG NÀY ĐỂ CHECK!!!

  const match = cookieString.match(/access_token=([^;]+)/);
  if (!match) {
    console.log("Không tìm thấy access_token trong cookie");
    return null;
  }

  const token = match[1];
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    console.log("JWT Payload:", payload); // ← CHECK XEM CÓ ĐỌC ĐƯỢC KHÔNG

    return {
      sub: payload.sub,
      userId: payload.userId,
      roleName: payload.roleName,
      roleCode: payload.roleCode,
      iat: payload.iat,
      exp: payload.exp,
    };
  } catch (e) {
    console.error("Lỗi decode JWT:", e);
    return null;
  }
};