from flask import Flask, render_template, request, jsonify, session, redirect, send_from_directory
import uuid
import x
import time
from flask_session import Session
from werkzeug.security import generate_password_hash  
from werkzeug.security import check_password_hash 
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity


from flask_cors import CORS
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from icecream import ic
ic.configureOutput(prefix=f"_____ | ", includeContext=True)

app = Flask(__name__)
CORS(app)  # allows everything
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)
app.config["JWT_SECRET_KEY"] = "password"
jwt = JWTManager(app)
#############
@app.route('/icons/<path:filename>')
def get_icon(filename):
    return send_from_directory('icons', filename)
##############################
@app.get("/")
def index():
    return jsonify({"status":"ok", "message":"Connected"})
############################## all signup routes
@app.post("/api-signup")
def signup():
    try:
        #USERS DATA
        user_id = uuid.uuid4().hex
        user_name = x.validate_user_name(request.json.get("user_name", ""))
        user_last_name = x.validate_user_last_name(request.json.get("user_last_name", ""))
        user_address = x.validate_user_address(request.json.get("user_address", ""))
        user_phone = x.validate_user_phone(request.json.get("user_phone", ""))
        user_email = x.validate_email(request.json.get("user_email", ""))
        user_password = x.validate_user_password(request.json.get("user_password", ""))
        
        #CAR DATA
        car_id= uuid.uuid4().hex
        car_plate = request.json.get("car_plate", "")
        car_user_fk = user_id
        # payment_name = request.json.get("payment_name", "")
        # user_payment_fk = user_id
        
        #USER_MEMBERSHIP DATA
        user_memberships_id = uuid.uuid4().hex
        membership_user_fk = user_id
        membership_fk = request.json.get("membership_fk", "")
        start_date = int(time.time())
        
       # TRANSACTION DATA
        transaction_id = uuid.uuid4().hex
        transaction_user_fk = user_id
        transaction_gateway_fk = request.json.get("transaction_gateway_fk", "")
        transaction_membership_fk = membership_fk
        
       

        #USERS DATA
        user_hashed_password = generate_password_hash(user_password)
       
        created_at = int(time.time())
        
     
       
        
        user_verification_key = uuid.uuid4().hex
        ic(user_verification_key)
        
       
      
    
        db, cursor = x.db()
        # When there are 2 or more updates, deletes and/or inserts, you must use a transaction
        db.start_transaction()
        q = "INSERT INTO users VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) "
        cursor.execute(q, (user_id, user_name, user_last_name, user_phone, user_email, user_hashed_password,user_address, created_at, None, user_verification_key, None, None))
        
        
        q = "INSERT INTO cars VALUES(%s, %s, %s, %s, %s, %s) "
        cursor.execute(q, (car_id, car_plate, car_user_fk, created_at, None, None))
       
        q = "INSERT INTO transactions VALUES(%s, %s, %s, %s, %s) "
        cursor.execute(q, (transaction_id, transaction_user_fk, transaction_gateway_fk, transaction_membership_fk, created_at))
        
        q = "INSERT INTO user_memberships VALUES(%s, %s, %s, %s, %s, %s, %s, %s) "
        cursor.execute(q, (user_memberships_id, membership_user_fk, membership_fk, start_date, None, "active", created_at, None))
       
    
        db.commit()
        html= render_template("___sign_up_email.html", user_verification_key = user_verification_key)
        x.send_email(user_email, html)
        return jsonify({"status": "ok", "message": "Signup successful", "verification_key": user_verification_key})
        
    except Exception as ex:
        ic(ex)
        # if the anything failed, do NOT stamp the changes in the database
        
        if "db" in locals(): db.rollback()
        if "company_exception user_name" in str(ex):
            return jsonify({ "status":"error", "message":f"user first name {x.USER_NAME_MIN} to {x.USER_NAME_MAX} characters"}), 400
    
        if "company_exception user_last_name" in str(ex):
            return jsonify({ "status":"error", "message":f"user last name {x.USER_LAST_NAME_MIN} to {x.USER_LAST_NAME_MAX} characters"}), 400

        if "company_exception user_address" in str(ex):
            return jsonify({"status": "error", "message": f"user address {x.USER_ADDRESS_MIN} to {x.USER_ADDRESS_MAX} characters"}), 400
    
        if "company_exception user_email" in str(ex):
            error_message = "email invalid"
            return jsonify({"status": "error", "message": error_message}), 400
        
        if "company_exception user_password" in str(ex):
            error_message = f"user password {x.USER_PASSWORD_MIN} to {x.USER_PASSWORD_MAX} characters"
            return jsonify({"status": "error", "message": error_message}), 400
        
       
        if "Duplicate entry" in str(ex) and "user_email" in str(ex):
            error_message = "Email already in use"
            return jsonify({"status": "error", "message": error_message}), 400
        # Worst case
        error_message = "System under maintenance"
        return jsonify({"status": "error", "message": str(ex)}), 500
    finally:
        if "cursor" in locals(): cursor.close()
        if "db" in locals(): db.close()
#################### 
@app.post("/sign-up-email") 
def signup_email():
 try:
     
    user_id = uuid.uuid4().hex
    user_name = x.validate_user_name(request.json.get("user_name", ""))
    user_verification_key = uuid.uuid4().hex
    # user_verified_at= int(time.time())
    # ic(user_verification_key)
    db, cursor = x.db()
    q = "INSERT INTO users (user_id, user_name, user_verification_key, user_verified_at) VALUES (%s, %s, %s, %s)"
    cursor.execute(q,(user_id, user_name, user_verification_key,  None))
    db.commit()
    

    html = render_template("___sign_up_email.html", user_verification_key = user_verification_key )
    x.send_email(html)
    return jsonify({"status": "ok", "message":"email sent "})
 except Exception as ex:
    ic(ex)
    return str(ex), 500
 finally:
    if "cursor" in locals():cursor.close()
    if "db" in locals(): db.close()
    
####################     
@app.post("/email-validation")
def email_validation():
    try:
        user_email = request.json.get("user_email", "")
        if not user_email:
            return jsonify({"status": "error", "message": "Email is required"}), 400

        user_email = x.validate_email(user_email)
        db, cursor = x.db()
        q = "SELECT user_email FROM users WHERE user_email = %s"
        cursor.execute(q, (user_email,))
        row = cursor.fetchone()
        if row:
            return jsonify({"status": "error", "message": "Email already in use"}), 400
        return jsonify({"status": "ok", "message": "Email is valid"}), 200
    except Exception as ex:
        ic(ex)
        if "company_exception email" in str(ex):
            return jsonify({"status": "error", "message": "Email invalid"}), 400
        if "Duplicate entry" in str(ex) and "user_email" in str(ex):
            error_message = "Email already in use"
            return jsonify({"status": "error", "message": error_message}), 400
        
        return jsonify({"status": "error", "message": "System under maintenance"}), 500
    finally:
        if "cursor" in locals(): cursor.close()
        if "db" in locals(): db.close()
 
##############################
@app.get("/verify/<key>")
def verify_account(key):
    try:
        key = x.validate_uuid4(key)
        db, cursor = x.db()
        user_verified_at = int(time.time())
        q = """
            UPDATE users
            SET user_verified_at = %s
            WHERE user_verification_key = %s AND user_verified_at IS NULL
        """
        cursor.execute(q, (user_verified_at, key))
        db.commit()
        if cursor.rowcount == 0:
            return jsonify({"status":"error","message":"user already exists"})
        return jsonify({"status":"ok","message":"Welcome to the system you are verified !"})
        
    except Exception as ex: 
        ic(ex)
        if "company_exception uuid4 invalid" in str(ex):
            return jsonify({"status": "error", "message": "Invalid"}), 400

        return jsonify({"status": "error", "message": "System under maintenance"}), 500
    finally:
        if "cursor" in locals(): cursor.close()
        if "db" in locals(): db.close()

############################ ck added # Checks if a user has clicked the verification link in their email
@app.get("/api-verification-status/<key>")
def verification_status(key):
    try:
        db, cursor = x.db()
        cursor.execute("SELECT user_verified_at FROM users WHERE user_verification_key = %s", (key,))
        user = cursor.fetchone()
        if not user:
            return jsonify({"status": "error", "message": "Key not found"}), 404
        verified = user["user_verified_at"] is not None
        return jsonify({"status": "ok", "verified": verified})
    except Exception as ex:
        return jsonify({"status": "error", "message": str(ex)}), 500
    finally:
        if "cursor" in locals(): cursor.close()
        if "db" in locals(): db.close()

############################ get payment method (for signup )
@app.get("/api-payment-gateways")
def get_payment_gateways():
    try:
        db, cursor = x.db()
        cursor.execute("SELECT  * FROM payment_gateway")
        gateways = cursor.fetchall()
        return jsonify({"status": "ok", "gateways": gateways})
    except Exception as ex:
        ic(ex)
        return jsonify({"status": "error", "message": "System under maintenance"}), 500
    finally:
        if "cursor" in locals(): cursor.close()
        if "db" in locals(): db.close()

############################ get mememberships(for signup )

@app.get("/api-memberships")
def get_memberships():
    try:
        db, cursor = x.db()
        cursor.execute("SELECT * FROM memberships")
        memberships = cursor.fetchall()
        return jsonify({"status": "ok", "memberships": memberships})
    except Exception as ex:
        ic(ex)
        return jsonify({"status": "error", "message": "System under maintenance"}), 500
    finally:
        if "cursor" in locals(): cursor.close()
        if "db" in locals(): db.close()
######################## LOGIN
# @app.get("/login")
# def show_login():
#     return render_template("page_login.html")

##################################################### 
@app.post("/api-login")
def login():
    try:
        user_email = x.validate_email(request.json.get("user_email", ""))
      
        
        user_password = x.validate_user_password(request.json.get("user_password", ""))
       
       
        # ic(user_email)

        
        # ic(user_password)
        
        db, cursor = x.db()
        q = "SELECT * FROM users WHERE user_email = %s LIMIT 1"
        
        cursor.execute(q,(user_email,))
        user = cursor.fetchone()
        
        # ic(access_token)
       
        
        if not user:
            return jsonify({"status": "error", "message": "User doesn't exist"}), 400

        if not check_password_hash(user["user_password"], user_password):
            return jsonify({"status": "error", "message": "Invalid credentials"}), 400
        # This creates a JWT — the ID badge the user keeps and sends with future requests untill it expires 
        access_token = create_access_token(identity=str(user["user_email"]))
        
       
        
        
        user.pop("user_password")
        # Flask's session is a server-side cookie that remembers the user across requests.
        
        html = render_template ("email_login_warning.html", ip = request.remote_addr)
        x.send_email(user_email, html)
        
        return jsonify({"status":"ok", "message":"Login successful", "user":user, "access_token": access_token}), 200
    
    except Exception as ex:
        ic(ex)
        return jsonify({"status": "error", "message": "System under maintenance"}), 500
    
    finally:
        if "cursor" in locals():cursor.close()
        if "db" in locals(): db.close()

#############  See Mine oplysninger
@app.get("/api-my-info")
@jwt_required()
def get_my_info():

    try:
        user_email = get_jwt_identity()
        db, cursor = x.db()
        q = """
        SELECT
            users.user_id,
            users.user_name,
            users.user_last_name,
            users.user_email,
            users.user_address,
            users.user_phone,
            cars.car_plate,

            payment_gateway.payment_gateway_name,
            payment_gateway.payment_gateway_id, # ck added
            
            memberships.membership_name,
            memberships.membership_description,
            memberships.membership_price
            
        FROM users

        LEFT JOIN cars
        ON cars.car_user_fk = users.user_id

        LEFT JOIN transactions
        ON transactions.transaction_id = (
            SELECT transaction_id
            FROM transactions 
            WHERE transaction_user_fk = users.user_id
            ORDER BY created_at DESC
            LIMIT 1
        )

        LEFT JOIN payment_gateway
        ON payment_gateway.payment_gateway_id = transactions.transaction_gateway_fk

        LEFT JOIN user_memberships
        ON user_memberships.user_memberships_id = (
            SELECT user_memberships_id
            FROM user_memberships 
            WHERE membership_user_fk = users.user_id
            ORDER BY (status = 'active') DESC, created_at DESC
            LIMIT 1
        )

        LEFT JOIN memberships
        ON memberships.membership_id = user_memberships.membership_fk

       

        WHERE users.user_email = %s

        LIMIT 1
        """
       
        cursor.execute(q, (user_email,))
        user = cursor.fetchone()

        if not user:
            return jsonify({
                "status": "error",
                "message": "User not found"
            }), 404

        return jsonify({"status": "ok","user": user}), 200

    except Exception as ex:

        ic(ex)

        return jsonify({
        "status": "error", "message": "System under maintenance"}), 500

    finally:

        if "cursor" in locals(): cursor.close()
        if "db" in locals(): db.close()

################ for profile page
@app.get("/api-my-membership")
@jwt_required()
def get_my_membership():

    try:

        user_email = get_jwt_identity()

        db, cursor = x.db()

        q = """
        SELECT
            

            memberships.membership_name,
            memberships.membership_description,
            memberships.membership_price
            

        FROM users

        LEFT JOIN user_memberships
        ON user_memberships.user_memberships_id = (
            SELECT user_memberships_id
            FROM user_memberships 
            WHERE membership_user_fk = users.user_id
            ORDER BY (status = 'active') DESC, created_at DESC
            LIMIT 1
        )

        LEFT JOIN memberships
        ON memberships.membership_id = user_memberships.membership_fk

        WHERE users.user_email = %s

        LIMIT 1
        """
      
        cursor.execute(q, (user_email,))
        user = cursor.fetchone()

        if not user:
            return jsonify({
                "status": "error",
                "message": "User not found"
            }), 404

        return jsonify({
            "status": "ok",
            "user": user
        }), 200

    except Exception as ex:

        ic(ex)

        return jsonify({
            "status": "error",
            "message": "System under maintenance"
        }), 500

    finally:

        if "cursor" in locals(): cursor.close()
        if "db" in locals(): db.close()


############# Update Mine oplysninger
@app.patch("/api-update-my-info")
@jwt_required()
def update_my_info():
    try:
       
        
        user_email = get_jwt_identity()
        data = request.json

        db, cursor = x.db()

        q = "SELECT user_id FROM users WHERE user_email = %s LIMIT 1"
        cursor.execute(q, (user_email,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"status": "error", "message": "User not found"}), 400

        user_id = user["user_id"]

        
        if "user_phone" in data:
            new_phone = x.validate_user_phone(data["user_phone"])
            q = "UPDATE users SET user_phone = %s WHERE user_id = %s"
            cursor.execute(q, (new_phone, user_id)) 

        if "user_email" in data:
            new_email = x.validate_email(data["user_email"])
            q = "UPDATE users SET user_email = %s WHERE user_id = %s"
            cursor.execute(q, (new_email, user_id))
               
        if "user_password" in data:
            new_password = x.validate_user_password(data["user_password"])
            hashed_password = generate_password_hash(new_password)

            q = "UPDATE users SET user_password = %s WHERE user_id = %s"
            cursor.execute(q, (hashed_password, user_id))
            
         # Update payment method through transactions
        if "transaction_gateway_fk" in data:
            q = """
            UPDATE transactions
            SET transaction_gateway_fk = %s
            WHERE transaction_user_fk = %s
            """
            cursor.execute(q, (data["transaction_gateway_fk"], user_id))
            
        if "user_address" in data:
            new_address = x.validate_user_address(data["user_address"])
            q = "UPDATE users SET user_address = %s WHERE user_id = %s"
            cursor.execute(q, (new_address, user_id)) 

        # Update cars table
        if "car_plate" in data:
            q = "UPDATE cars SET car_plate = %s WHERE car_user_fk = %s"
            cursor.execute(q, (data["car_plate"], user_id))

        # Update membership
        if "membership_fk" in data:
            q = "UPDATE user_memberships SET membership_fk = %s WHERE membership_user_fk = %s"
            cursor.execute(q, (data["membership_fk"], user_id))

        db.commit()

        return jsonify({
            "status": "ok",
            "message": "User info updated"
        }), 200

    except Exception as ex:
        ic(ex)
        return jsonify({
            "status": "error",
            "message": str(ex)
        }), 500

    finally:
        if "cursor" in locals(): cursor.close()
        if "db" in locals(): db.close()

#################
@app.patch("/api-update-my-membership")
@jwt_required()
def update_my_membership():
    try:
        user_email = get_jwt_identity()
        data = request.json

        db, cursor = x.db()

        q = "SELECT user_id FROM users WHERE user_email = %s LIMIT 1"
        cursor.execute(q, (user_email,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"status": "error", "message": "User not found"}), 400

        user_id = user["user_id"]

        if "membership_fk" in data:
            # Check the membership being requested actually exists
            q = "SELECT membership_id FROM memberships WHERE membership_id = %s LIMIT 1"
            cursor.execute(q, (data["membership_fk"],))
            membership = cursor.fetchone()

            if not membership:
                return jsonify({"status": "error", "message": "Membership not found"}), 400

            q = """
            UPDATE user_memberships
            SET membership_fk = %s
            WHERE membership_user_fk = %s
            """
            cursor.execute(q, (data["membership_fk"], user_id))

        db.commit()

        return jsonify({
            "status": "ok",
            "message": "Membership updated"
        }), 200

    except Exception as ex:
        ic(ex)
        return jsonify({
            "status": "error",
            "message": str(ex)
        }), 500

    finally:
        if "cursor" in locals(): cursor.close()
        if "db" in locals(): db.close()
  
##################################################
#### LEFT JOIN memberships ON memberships.membership_id = wash.membership_wash_fk this does that the membership the user has when they do 
# the wash, is the one that shows in the wash history, 
# if they change their membership after doing the wash, it will not change the membership that shows in the wash history, 
# because we save the membership id in the wash table when they do the wash, so we can always show the correct membership in the wash history.
@app.get("/api-my-wash-history")
@jwt_required()
def get_my_wash_history():
    try:
        user_email = get_jwt_identity()
        db, cursor = x.db()
 
        cursor.execute("SELECT user_id FROM users WHERE user_email = %s LIMIT 1", (user_email,))
        user = cursor.fetchone()
        if not user:
            return jsonify({"status": "error", "message": "User not found"}), 404
 
        user_id = user["user_id"]
 
        cursor.execute("""
            SELECT
                wash.wash_id,
                wash.created_at,
                memberships.membership_name,
                memberships.membership_price
            FROM wash
            LEFT JOIN memberships ON memberships.membership_id = wash.membership_wash_fk
            WHERE wash.user_wash_fk = %s
            ORDER BY wash.created_at DESC
        """, (user_id,))
        washes = cursor.fetchall()
 
        return jsonify({"status": "ok", "washes": washes}), 200
 
    except Exception as ex:
        ic(ex)
        return jsonify({"status": "error", "message": "System under maintenance"}), 500
    finally:
        if "cursor" in locals(): cursor.close()
        if "db" in locals(): db.close()
 
######### forgot password  ##################################################
##############################
# @app.get("/forgot-password")
# def show_forgot_password():
#     return render_template("page_forgot_password.html")

##############################
@app.post("/forgot-password")
def forgot_password():
    try:
        user_reset_password_key = uuid.uuid4().hex + uuid.uuid4().hex
        user_email = x.validate_email(request.json.get("user_email", ""))
        
        db, cursor = x.db()
        
        db.start_transaction()
        # to check if the user exists
        q = "SELECT user_id FROM users WHERE user_email = %s"
        cursor.execute(q, (user_email,))
        row = cursor.fetchone()
        if not row: return jsonify({"status":"error","message":"user doesn't exist"}), 400
        # here i am saving the reset key to the DB
        
        q = "UPDATE users SET user_reset_password_key = %s WHERE user_email = %s"
        cursor.execute(q, (user_reset_password_key, user_email,))
        db.commit()
       
       # here i am sending the email with the key saved in the previous q
        html = render_template("email_forgot_password.html", user_reset_password_key=user_reset_password_key)
       
        
        x.send_email(user_email, html)

        return jsonify({"status":"ok", "message":"success"}),400

    except Exception as ex:
        ic(ex)
        
        if "db" in locals(): db.rollback()

        if "company_exception email" in str(ex):
            jsonify({"status":"error","message":"invalid email "}), 400

        jsonify({"status":"error","message":"system under maintanance"}), 500
    finally:
        if "cursor" in locals(): cursor.close()
        if "db" in locals(): db.close()



##############################
@app.get("/reset-password/<key>")
def show_reset_password(key):
    try:
        key = x.validate_uuid4_paranoia(key)
        db, cursor = x.db()
        q = "SELECT user_reset_password_key FROM users WHERE user_reset_password_key = %s"
        cursor.execute(q, (key,))
        row = cursor.fetchone()
        if not row:
            return {"status": "error", "message": "user doesn't exist"}, 400
        # If browser requests HTML, redirect to the Next.js reset password page with the key
        if "text/html" in request.headers.get("Accept", ""):
            # Adjust the URL below if your frontend runs on a different port or domain
            frontend_url = f"http://localhost:3000/pages/reset-password?key={key}"
            return redirect(frontend_url)
        # For SPA/Next.js, just return OK and the key
        return {"status": "ok", "key": key}, 200
    except Exception as ex:
        ic(ex)
        if "company_exception paranoia" in str(ex):
            return ({"status": "error", "message": "Invalid Key"}), 400
        return ({"status": "error", "message": str(ex)}), 500
    finally:
        if "cursor" in locals(): cursor.close()
        if "db" in locals(): db.close()  
##############################
@app.post("/reset-password")
def reset_password():
    try:
        password = x.validate_user_password(request.json.get("password", ""))
        # password = x.validate_user_password(request.form.get("password", ""))
        confirm_password = request.json.get("confirm-password", "").strip()
        # confirm_password = request.form.get("confirm-password", "").strip()

        if confirm_password != password:
            return jsonify({"status":"error","message":"passwords doesn't match"}), 400

        # key = x.validate_uuid4_paranoia(request.json.get("key", ""))
        key = x.validate_uuid4_paranoia(request.json.get("key", ""))

        user_hashed_password = generate_password_hash(password)

        db, cursor = x.db()

        q = """
            UPDATE users
            SET 
                user_password = %s,
                user_reset_password_key = NULL
            WHERE user_reset_password_key = %s
        """
        cursor.execute(q, (user_hashed_password, key))
        db.commit()

        if cursor.rowcount == 0:
            return jsonify({"status":"error","message":"ups try again"}), 400

       
        return jsonify({"status":"ok","message":"Succes"}), 200

    except Exception as ex:
        ic(ex)

        if "company_exception user_password" in str(ex):
            return f"Password {x.USER_PASSWORD_MIN} to {x.USER_PASSWORD_MAX} characters", 400

        if "company_exception uuid4 invalid" in str(ex):
            return jsonify({"status":"error","message":"invalid key"}), 400

        return str(ex), 500

    finally:
        if "cursor" in locals(): cursor.close()
        if "db" in locals(): db.close()




############################## #hjertet
# Returns all favorite location ids for the logged in user
@app.get("/api-favorites")
@jwt_required()
def get_favorites():
    try:
        user_email = get_jwt_identity()
        db, cursor = x.db()
        cursor.execute("SELECT location_id FROM favorites WHERE user_email = %s", (user_email,))
        rows = cursor.fetchall()
        location_ids = [row["location_id"] for row in rows]
        return jsonify({"status": "ok", "favorites": location_ids}), 200
    except Exception as ex:
        ic(ex)
        return jsonify({"status": "error", "message": str(ex)}), 500
    finally:
        if "cursor" in locals(): cursor.close()
        if "db" in locals(): db.close()

##############################
@app.post("/api-favorites") #hjertet
@jwt_required()
def add_favorite():
    try:
        user_email = get_jwt_identity()
        location_id = request.json.get("location_id", "")
        db, cursor = x.db()
        q = "INSERT INTO favorites (favorite_id, user_email, location_id) VALUES (%s, %s, %s)"
        cursor.execute(q, (uuid.uuid4().hex, user_email, location_id))
        db.commit()
        return jsonify({"status": "ok"}), 200
    except Exception as ex:
        ic(ex)
        return jsonify({"status": "error", "message": str(ex)}), 500
    finally:
        if "cursor" in locals(): cursor.close()
        if "db" in locals(): db.close()



##############################
@app.delete("/api-favorites") #hjertet
@jwt_required()
def remove_favorite():
    try:
        user_email = get_jwt_identity()
        location_id = request.json.get("location_id", "")
        db, cursor = x.db()
        q = "DELETE FROM favorites WHERE user_email = %s AND location_id = %s"
        cursor.execute(q, (user_email, location_id))
        db.commit()
        return jsonify({"status": "ok"}), 200
    except Exception as ex:
        ic(ex)
        return jsonify({"status": "error", "message": str(ex)}), 500
    finally:
        if "cursor" in locals(): cursor.close()
        if "db" in locals(): db.close()


# Frontend sends a post request to this endpoint when the user clicks the "start wash" button. 
# The endpoint creates a new wash record in the database linked to the logged in user and their 
# membership (if they have one). It returns the wash_id of the newly created wash, which can be 
# used by the frontend to track the wash status and display it to the user.

@app.post("/api-start-wash")        # listens for POST requests on /api-start-wash
@jwt_required()                     # requires a valid JWT token — protected route
def start_wash():
    try:
        wash_id = uuid.uuid4().hex  # generates a unique id for the wash
        user_email = get_jwt_identity()     # 1. gets the user email from the JWT token
        db, cursor = x.db()                 # opens database connection

        cursor.execute("SELECT user_id FROM users WHERE user_email = %s LIMIT 1", (user_email,))
        user = cursor.fetchone()            # 1. fetches the user from the database
        if not user:
            return jsonify({"status": "error", "message": "User not found"}), 404
        user_id = user["user_id"]           # 1. gets the user_id from the fetched user

        cursor.execute("""
            SELECT membership_fk
            FROM user_memberships
            WHERE membership_user_fk = %s
            LIMIT 1
        """, (user_id,))
        membership = cursor.fetchone()      # 2. fetches the user's active membership
        membership_id = membership["membership_fk"] if membership else None
                                             # 2. gets the membership id — None if no membership found

        cursor.execute("""
            INSERT INTO wash (wash_id, created_at, user_wash_fk, membership_wash_fk)
            VALUES (%s, %s, %s, %s)
        """, (wash_id, int(time.time()), user_id, membership_id))
                                            # 3. inserts a new wash row into the wash table
        db.commit()                         # 3. stamps the changes to the database

        return jsonify({"status": "ok", "wash_id": wash_id}), 200
                                            # 4. returns success response with the wash id to the frontend

    except Exception as ex:
        ic(ex)                              # prints the error in the terminal for debugging
        return jsonify({"status": "error", "message": "System under maintenance"}), 500
                                            # worst case — system error

    finally:
        if "cursor" in locals(): cursor.close()     # always close the cursor
        if "db" in locals(): db.close()             # always close the database connection




##############################
@app.delete("/api-delete-account") #slet konto
@jwt_required()
def delete_account():
    try:
        user_email = get_jwt_identity()
        db, cursor = x.db()
        db.start_transaction()
        q = "SELECT user_id FROM users WHERE user_email = %s"
        cursor.execute(q, (user_email,))
        user = cursor.fetchone()
        if not user:
            return jsonify({"status": "error", "message": "User not found"}), 404
        user_id = user["user_id"]
        cursor.execute("DELETE FROM favorites WHERE user_email = %s", (user_email,))
        cursor.execute("DELETE FROM cars WHERE car_user_fk = %s", (user_id,))
        cursor.execute("DELETE FROM user_memberships WHERE membership_user_fk = %s", (user_id,))
        cursor.execute("DELETE FROM transactions WHERE transaction_user_fk = %s", (user_id,))
        cursor.execute("DELETE FROM users WHERE user_id = %s", (user_id,))
        db.commit()
        return jsonify({"status": "ok", "message": "Account deleted"}), 200
    except Exception as ex:
        ic(ex)
        if "db" in locals(): db.rollback()
        return jsonify({"status": "error", "message": str(ex)}), 500
    finally:
        if "cursor" in locals(): cursor.close()
        if "db" in locals(): db.close()
