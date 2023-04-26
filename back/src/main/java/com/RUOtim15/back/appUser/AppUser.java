package com.RUOtim15.back.appUser;

import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Entity
public class AppUser {

    @Id
    protected Long id;

    private String name;

    private String lastName;

    private LocalDateTime birthday;

    private String userName;

    private String email;

    private String password;

}
