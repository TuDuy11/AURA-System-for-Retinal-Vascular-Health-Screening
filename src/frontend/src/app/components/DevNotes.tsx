/**
 * DEV NOTES - RBAC Authentication Flow
 * 
 * This component documents the authentication and authorization flow
 * for developers implementing the production version.
 */

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Code2, Database, Shield, Key, UserCheck, ArrowRight, ArrowLeft } from 'lucide-react';

interface DevNotesProps {
  onBack?: () => void;
}

export function DevNotes({ onBack }: DevNotesProps) {
  return (
    <div className="max-w-5xl mx-auto space-y-6 p-8">
      {onBack && (
        <div className="mb-4">
          <Button onClick={onBack} variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to App
          </Button>
        </div>
      )}

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-2">
          AURA Authentication System
        </h1>
        <p className="text-gray-600">Developer Implementation Notes</p>
        <p className="text-sm text-gray-500 mt-1">Includes: RBAC, Google OAuth, Public Home Navigation</p>
      </div>

      {/* API Flow */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-blue-600" />
            API Flow Sequence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Badge className="mt-1">1</Badge>
              <div>
                <p className="font-semibold">UI calls AuthController.login(LoginRequest)</p>
                <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                  POST /api/auth/login
                </code>
              </div>
            </div>

            <div className="flex items-center gap-2 pl-8">
              <ArrowRight className="w-4 h-4 text-cyan-500" />
              <span className="text-sm text-gray-600">AuthService.login(request)</span>
            </div>

            <div className="flex items-start gap-3">
              <Badge className="mt-1">2</Badge>
              <div>
                <p className="font-semibold">IUserRepository.findByEmail(email)</p>
                <p className="text-sm text-gray-600">If user == null → return 401 Unauthorized</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Badge className="mt-1">3</Badge>
              <div>
                <p className="font-semibold">IPasswordHasher.verify(raw, hash)</p>
                <p className="text-sm text-gray-600">If verify == false → return 401 Unauthorized</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Badge className="mt-1">4</Badge>
              <div>
                <p className="font-semibold">IRoleRepository.getRolesByUserId(userId)</p>
                <p className="text-sm text-gray-600">Returns List&lt;Role&gt;</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Badge className="mt-1">5</Badge>
              <div>
                <p className="font-semibold">ITokenService.generateAccessToken + generateRefreshToken</p>
                <p className="text-sm text-gray-600">Generate JWT tokens with user info and roles</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Badge className="mt-1">6</Badge>
              <div>
                <p className="font-semibold">Return LoginResponse</p>
                <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded block mt-1">
                  {`{ accessToken, refreshToken, roles: [Role], user: UserInfo }`}
                </code>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Badge className="mt-1">7</Badge>
              <div>
                <p className="font-semibold">UI redirect based on roles[]</p>
                <p className="text-sm text-gray-600">PATIENT → Patient Dashboard | DOCTOR → Doctor Dashboard</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* DTO Mapping */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            DTO Field Mapping
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">LoginRequest</h4>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`{
  email: string;
  password: string;
}`}
            </pre>
          </div>

          <div>
            <h4 className="font-semibold mb-2">LoginResponse</h4>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`{
  accessToken: string;
  refreshToken: string;
  roles: Role[];
  user: UserInfo;
}`}
            </pre>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Role</h4>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`{
  id: string;
  name: 'PATIENT' | 'DOCTOR' | 'ADMIN';
  displayName: string;
}`}
            </pre>
          </div>

          <div>
            <h4 className="font-semibold mb-2">UserInfo</h4>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`{
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
}`}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* RBAC Implementation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            RBAC Implementation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="font-semibold text-blue-900 mb-2">Important: Role-Based Redirect</p>
            <p className="text-sm text-blue-800">
              The UI pill "Bệnh nhân/Bác sĩ" is for UX only. The actual role is determined by 
              <code className="bg-white px-1 mx-1 rounded">LoginResponse.roles</code> returned from the backend.
              This ensures security and prevents client-side role manipulation.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Role Guard Logic</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Patient can only access Patient Dashboard and related pages</li>
              <li>• Doctor can only access Doctor Dashboard and related pages</li>
              <li>• Attempting to access unauthorized routes shows "Access Denied" page</li>
              <li>• Logo click always returns to the correct dashboard based on user role</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Error States */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-blue-600" />
            UI States & Error Handling
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <h4 className="font-semibold mb-2">Login States</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Badge variant="outline">Idle</Badge>
                <span className="text-gray-600">Default state, form ready for input</span>
              </li>
              <li className="flex items-center gap-2">
                <Badge variant="outline">Submitting</Badge>
                <span className="text-gray-600">Loading spinner, button disabled</span>
              </li>
              <li className="flex items-center gap-2">
                <Badge variant="destructive">Error 401</Badge>
                <span className="text-gray-600">"Email hoặc mật khẩu không đúng"</span>
              </li>
              <li className="flex items-center gap-2">
                <Badge variant="default">Success</Badge>
                <span className="text-gray-600">Redirect to dashboard based on role</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Error Messages Mapping</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• user == null → "Email hoặc mật khẩu không đúng" (Invalid credentials)</li>
              <li>• verify == false → "Email hoặc mật khẩu không đúng" (Invalid credentials)</li>
              <li>• Other errors → "Có lỗi xảy ra. Vui lòng thử lại."</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Demo Accounts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5 text-blue-600" />
            Demo Accounts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Patient Account</h4>
              <p className="text-sm text-blue-800">
                <strong>Email:</strong> patient@example.com<br />
                <strong>Password:</strong> password<br />
                <strong>Role:</strong> PATIENT
              </p>
            </div>

            <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
              <h4 className="font-semibold text-cyan-900 mb-2">Doctor Account</h4>
              <p className="text-sm text-cyan-800">
                <strong>Email:</strong> doctor@aura.vn<br />
                <strong>Password:</strong> password<br />
                <strong>Role:</strong> DOCTOR
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Google OAuth Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-blue-600" />
            Google OAuth Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="font-semibold text-green-900 mb-2">✓ Feature Implemented</p>
            <p className="text-sm text-green-800">
              Google Login button added to Login page with full state management (Loading, Error, Success)
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">API Flow</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-3">
                <Badge className="mt-1">1</Badge>
                <div>
                  <p className="font-medium">UI calls AuthController.loginWithGoogle(GoogleLoginRequest)</p>
                  <code className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded block mt-1">
                    POST /api/auth/google OR GET /api/auth/google (redirect)
                  </code>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Badge className="mt-1">2</Badge>
                <div>
                  <p className="font-medium">Backend verifies Google ID token with Google API</p>
                  <p className="text-xs text-gray-600">Call Google's tokeninfo endpoint to validate idToken</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Badge className="mt-1">3</Badge>
                <div>
                  <p className="font-medium">Extract user info from verified token</p>
                  <p className="text-xs text-gray-600">Get email, name, avatar from Google response</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Badge className="mt-1">4</Badge>
                <div>
                  <p className="font-medium">Find or create user in database</p>
                  <p className="text-xs text-gray-600">If user exists → login, else → create new user account</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Badge className="mt-1">5</Badge>
                <div>
                  <p className="font-medium">Return same LoginResponse format</p>
                  <code className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded block mt-1">
                    {'{ accessToken, refreshToken, roles: [Role], user: UserInfo }'}
                  </code>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">GoogleLoginRequest DTO</h4>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`{
  idToken: string; // Google ID token from OAuth
}`}
            </pre>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Mock Implementation</h4>
            <p className="text-sm text-gray-600 mb-2">
              For demo purposes, we use mock tokens:
            </p>
            <ul className="space-y-1 text-sm text-gray-600 ml-4 list-disc">
              <li><code className="bg-gray-100 px-1 rounded">MOCK_GOOGLE_TOKEN_PATIENT</code> → Patient account</li>
              <li><code className="bg-gray-100 px-1 rounded">MOCK_GOOGLE_TOKEN_DOCTOR</code> → Doctor account</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Production Implementation</h4>
            <ul className="space-y-1 text-sm text-gray-600 ml-4 list-disc">
              <li>Use Google OAuth 2.0 Client Library</li>
              <li>Redirect to Google OAuth consent screen OR use popup</li>
              <li>Handle callback with authorization code</li>
              <li>Exchange code for ID token</li>
              <li>Verify token signature and claims</li>
              <li>Store Google user ID for future logins</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Public Home Icon Navigation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Public Home Icon Navigation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="font-semibold text-green-900 mb-2">✓ Feature Implemented</p>
            <p className="text-sm text-green-800">
              Public Home icon added to all screens (Login, Dashboards) with logout flow
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">User Flow</h4>
            <div className="space-y-2 text-sm">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-3">
                <p className="font-medium text-blue-900">Scenario 1: User NOT logged in (on Login page)</p>
                <p className="text-blue-800 mt-1">
                  Click Home Icon → Navigate to Public Landing Page
                </p>
              </div>

              <div className="bg-cyan-50 border-l-4 border-cyan-500 p-3">
                <p className="font-medium text-cyan-900">Scenario 2: User logged in (on Dashboard)</p>
                <p className="text-cyan-800 mt-1">
                  Click Home Icon → Logout (clear session + tokens) → Navigate to Public Landing Page
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Technical Implementation</h4>
            <ul className="space-y-1 text-sm text-gray-600 ml-4 list-disc">
              <li>Icon positioned at top-right corner (fixed position)</li>
              <li>Styled with cyan gradient on dashboard, translucent on login</li>
              <li>Calls <code className="bg-gray-100 px-1 rounded">AuthController.logout()</code> before navigation</li>
              <li>Clears localStorage tokens and session data</li>
              <li>Resets app state to guest user</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Icon Placement</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>Login Page:</strong> Top-right, translucent white backdrop</p>
              <p><strong>Dashboard:</strong> Top-right, cyan gradient button (fixed over header)</p>
              <p><strong>Tooltip:</strong> "Quay về trang chủ" / "Đăng xuất và quay về trang chủ"</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Implementation Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Production Implementation Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <h4 className="font-semibold mb-1">Security Considerations</h4>
            <ul className="space-y-1 text-gray-600 ml-4 list-disc">
              <li>Use bcrypt or similar for password hashing (current demo uses plain text comparison)</li>
              <li>Implement JWT with proper signing algorithm (RS256 recommended)</li>
              <li>Set appropriate token expiration times</li>
              <li>Implement refresh token rotation</li>
              <li>Add rate limiting to login endpoint</li>
              <li>Use HTTPS only in production</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-1">Database Schema</h4>
            <ul className="space-y-1 text-gray-600 ml-4 list-disc">
              <li>users table: id, email, password_hash, full_name, avatar, created_at</li>
              <li>roles table: id, name, display_name</li>
              <li>user_roles table: user_id, role_id (many-to-many)</li>
              <li>Optional: permissions table + role_permissions for fine-grained access control</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-1">Testing</h4>
            <ul className="space-y-1 text-gray-600 ml-4 list-disc">
              <li>Test invalid email → 401 response</li>
              <li>Test invalid password → 401 response</li>
              <li>Test successful login with PATIENT role → redirects to Patient Dashboard</li>
              <li>Test successful login with DOCTOR role → redirects to Doctor Dashboard</li>
              <li>Test role guard: Patient trying to access Doctor routes → Access Denied</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}